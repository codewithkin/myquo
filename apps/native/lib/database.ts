import * as SQLite from 'expo-sqlite';

// Database instance
let db: SQLite.SQLiteDatabase | null = null;

// Quote interface
export interface Quote {
    id: string;
    text: string;
    author: string;
    category?: string;
    month?: number; // 1-12, null for any month
    weekday?: number; // 0-6 (Sunday-Saturday), null for any day
    holiday?: string; // Holiday name, null for non-holiday quotes
    weight?: number; // Selection weight (default 1)
}

// Favorite interface
export interface FavoriteQuote extends Quote {
    savedAt: string;
}

// History entry interface
export interface HistoryEntry {
    id: number;
    quoteId: string;
    displayedAt: string;
    date: string; // YYYY-MM-DD format
}

// Initialize and get database
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (db) return db;

    db = await SQLite.openDatabaseAsync('myquo.db');

    // Create tables
    await db.execAsync(`
        -- Quotes table
        CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT,
            month INTEGER,
            weekday INTEGER,
            holiday TEXT,
            weight REAL DEFAULT 1.0
        );

        -- Favorites table
        CREATE TABLE IF NOT EXISTS favorites (
            quote_id TEXT PRIMARY KEY,
            saved_at TEXT NOT NULL,
            FOREIGN KEY (quote_id) REFERENCES quotes(id)
        );

        -- History table
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote_id TEXT NOT NULL,
            displayed_at TEXT NOT NULL,
            date TEXT NOT NULL UNIQUE,
            FOREIGN KEY (quote_id) REFERENCES quotes(id)
        );
    `);

    // Seed with sample quotes if empty
    const count = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM quotes');
    if (count && count.count === 0) {
        await seedQuotes(db);
    }

    return db;
}

// Seed initial quotes
async function seedQuotes(database: SQLite.SQLiteDatabase): Promise<void> {
    const quotes: Omit<Quote, 'id'>[] = [
        // General motivational quotes
        { text: "Your limitation—it's only your imagination.", author: 'Unknown', weight: 1 },
        { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown', weight: 1 },
        { text: 'Great things never come from comfort zones.', author: 'Unknown', weight: 1 },
        { text: 'Dream it. Wish it. Do it.', author: 'Unknown', weight: 1 },
        { text: "Success doesn't just find you. You have to go out and get it.", author: 'Unknown', weight: 1 },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: 'Unknown', weight: 1 },
        { text: "Don't stop when you're tired. Stop when you're done.", author: 'Unknown', weight: 1 },
        { text: 'Wake up with determination. Go to bed with satisfaction.', author: 'Unknown', weight: 1 },
        { text: "Do something today that your future self will thank you for.", author: 'Unknown', weight: 1 },
        { text: 'Little things make big days.', author: 'Unknown', weight: 1 },
        { text: "It's going to be hard, but hard does not mean impossible.", author: 'Unknown', weight: 1 },
        { text: "Don't wait for opportunity. Create it.", author: 'Unknown', weight: 1 },
        { text: 'Sometimes we are tested not to show our weaknesses, but to discover our strengths.', author: 'Unknown', weight: 1 },
        { text: 'The key to success is to focus on goals, not obstacles.', author: 'Unknown', weight: 1 },
        { text: "Dream bigger. Do bigger.", author: 'Unknown', weight: 1 },

        // Monday motivation
        { text: 'Monday is a fresh start. Embrace it.', author: 'Unknown', weekday: 1, weight: 1.5 },
        { text: 'New week, new goals, new opportunities.', author: 'Unknown', weekday: 1, weight: 1.5 },

        // Friday vibes
        { text: "Friday: The golden child of the weekdays.", author: 'Unknown', weekday: 5, weight: 1.5 },
        { text: 'Make it a Friday to remember.', author: 'Unknown', weekday: 5, weight: 1.5 },

        // New Year quotes (January)
        { text: 'New year, new chapter, new verse, or just the same old story. Ultimately, we write it.', author: 'Alex Morritt', month: 1, weight: 2 },
        { text: 'Year\'s end is neither an end nor a beginning but a going on.', author: 'Hal Borland', month: 1, weight: 2 },

        // Holiday quotes
        { text: 'Cheers to a new year and another chance for us to get it right.', author: 'Oprah Winfrey', holiday: 'new_year', weight: 3 },
        { text: 'Be thankful for what you have; you\'ll end up having more.', author: 'Oprah Winfrey', holiday: 'thanksgiving', weight: 3 },

        // More general quotes
        { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', weight: 1 },
        { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', weight: 1 },
        { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', weight: 1 },
        { text: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela', weight: 1 },
        { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', weight: 1 },
        { text: 'What you get by achieving your goals is not as important as what you become by achieving your goals.', author: 'Zig Ziglar', weight: 1 },
        { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein', weight: 1 },
    ];

    for (let i = 0; i < quotes.length; i++) {
        const quote = quotes[i];
        const id = `q${String(i + 1).padStart(3, '0')}`;

        await database.runAsync(
            `INSERT OR IGNORE INTO quotes (id, text, author, category, month, weekday, holiday, weight)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, quote.text, quote.author, quote.category ?? null, quote.month ?? null, quote.weekday ?? null, quote.holiday ?? null, quote.weight ?? 1]
        );
    }
}

// Close database connection
export async function closeDatabase(): Promise<void> {
    if (db) {
        await db.closeAsync();
        db = null;
    }
}
