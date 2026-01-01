import { getDatabase, Quote, HistoryEntry } from './database';

interface QuoteContext {
    date: Date;
    weekday: number; // 0-6 (Sunday-Saturday)
    month: number; // 1-12
    holiday?: string;
    deviceSeed: string;
}

// Get current context for quote selection
export function getQuoteContext(deviceSeed: string = 'default'): QuoteContext {
    const now = new Date();
    return {
        date: now,
        weekday: now.getDay(),
        month: now.getMonth() + 1,
        holiday: getHoliday(now),
        deviceSeed,
    };
}

// Check if today is a known holiday
function getHoliday(date: Date): string | undefined {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Simple holiday detection (US holidays)
    if (month === 1 && day === 1) return 'new_year';
    if (month === 2 && day === 14) return 'valentines';
    if (month === 7 && day === 4) return 'independence_day';
    if (month === 10 && day === 31) return 'halloween';
    if (month === 12 && day === 25) return 'christmas';
    if (month === 12 && day === 31) return 'new_years_eve';

    // Thanksgiving (4th Thursday of November)
    if (month === 11) {
        const firstDay = new Date(date.getFullYear(), 10, 1).getDay();
        const thanksgivingDay = 22 + ((11 - firstDay) % 7);
        if (day === thanksgivingDay) return 'thanksgiving';
    }

    return undefined;
}

// Deterministic hash function for consistent quote selection
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Get today's quote based on context
export async function getTodayQuote(context: QuoteContext): Promise<Quote | null> {
    const db = await getDatabase();
    const dateString = formatDate(context.date);

    // Check if we already have a quote logged for today
    const historyEntry = await db.getFirstAsync<HistoryEntry & Quote>(
        `SELECT h.*, q.text, q.author, q.category, q.month, q.weekday, q.holiday, q.weight
         FROM history h
         JOIN quotes q ON h.quote_id = q.id
         WHERE h.date = ?`,
        [dateString]
    );

    if (historyEntry) {
        return {
            id: historyEntry.quoteId,
            text: historyEntry.text,
            author: historyEntry.author,
            category: historyEntry.category,
            month: historyEntry.month,
            weekday: historyEntry.weekday,
            holiday: historyEntry.holiday,
            weight: historyEntry.weight,
        };
    }

    // Select a new quote for today
    const quote = await selectQuoteForContext(context);
    if (quote) {
        // Log to history
        await logQuoteToHistory(quote.id, context.date);
    }

    return quote;
}

// Select quote based on context with weighted algorithm
async function selectQuoteForContext(context: QuoteContext): Promise<Quote | null> {
    const db = await getDatabase();

    // Get yesterday's quote to avoid repeats
    const yesterday = new Date(context.date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = formatDate(yesterday);

    const yesterdayEntry = await db.getFirstAsync<{ quote_id: string }>(
        'SELECT quote_id FROM history WHERE date = ?',
        [yesterdayString]
    );
    const yesterdayQuoteId = yesterdayEntry?.quote_id;

    // Build candidates query based on context
    let candidates: Quote[] = [];

    // Priority 1: Holiday-specific quotes
    if (context.holiday) {
        candidates = await db.getAllAsync<Quote>(
            `SELECT * FROM quotes WHERE holiday = ? AND id != ?`,
            [context.holiday, yesterdayQuoteId ?? '']
        );
    }

    // Priority 2: Month + Weekday specific quotes
    if (candidates.length === 0) {
        candidates = await db.getAllAsync<Quote>(
            `SELECT * FROM quotes
             WHERE ((month = ? OR month IS NULL) AND (weekday = ? OR weekday IS NULL))
             AND holiday IS NULL
             AND id != ?
             ORDER BY 
               CASE WHEN month = ? AND weekday = ? THEN 4
                    WHEN month = ? THEN 3
                    WHEN weekday = ? THEN 2
                    ELSE 1 END DESC`,
            [context.month, context.weekday, yesterdayQuoteId ?? '', context.month, context.weekday, context.month, context.weekday]
        );
    }

    // Priority 3: Fallback to any quote
    if (candidates.length === 0) {
        candidates = await db.getAllAsync<Quote>(
            `SELECT * FROM quotes WHERE id != ?`,
            [yesterdayQuoteId ?? '']
        );
    }

    if (candidates.length === 0) {
        // Absolute fallback - even include yesterday's quote
        candidates = await db.getAllAsync<Quote>('SELECT * FROM quotes');
    }

    if (candidates.length === 0) {
        return null;
    }

    // Weighted deterministic selection
    return selectWeightedQuote(candidates, context);
}

// Weighted deterministic selection algorithm
function selectWeightedQuote(candidates: Quote[], context: QuoteContext): Quote {
    const dateString = formatDate(context.date);
    const seed = hashString(`${dateString}-${context.deviceSeed}`);

    // Calculate total weight
    const totalWeight = candidates.reduce((sum, q) => sum + (q.weight ?? 1), 0);

    // Deterministic selection based on seed
    const targetWeight = (seed % (totalWeight * 100)) / 100;

    let currentWeight = 0;
    for (const quote of candidates) {
        currentWeight += quote.weight ?? 1;
        if (currentWeight >= targetWeight) {
            return quote;
        }
    }

    // Fallback to last candidate
    return candidates[candidates.length - 1];
}

// Log quote to history
async function logQuoteToHistory(quoteId: string, date: Date): Promise<void> {
    const db = await getDatabase();
    const dateString = formatDate(date);
    const timestamp = date.toISOString();

    await db.runAsync(
        `INSERT OR REPLACE INTO history (quote_id, displayed_at, date) VALUES (?, ?, ?)`,
        [quoteId, timestamp, dateString]
    );
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Get quote history
export async function getQuoteHistory(limit: number = 30): Promise<(HistoryEntry & Quote)[]> {
    const db = await getDatabase();

    return db.getAllAsync<HistoryEntry & Quote>(
        `SELECT h.id, h.quote_id as quoteId, h.displayed_at as displayedAt, h.date,
                q.text, q.author, q.category, q.month, q.weekday, q.holiday, q.weight
         FROM history h
         JOIN quotes q ON h.quote_id = q.id
         ORDER BY h.date DESC
         LIMIT ?`,
        [limit]
    );
}

// Get a specific quote by ID
export async function getQuoteById(id: string): Promise<Quote | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Quote>('SELECT * FROM quotes WHERE id = ?', [id]);
}
