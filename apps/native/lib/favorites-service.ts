import { getDatabase, Quote, FavoriteQuote } from './database';

// Check if a quote is favorited
export async function isFavorited(quoteId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM favorites WHERE quote_id = ?',
        [quoteId]
    );
    return (result?.count ?? 0) > 0;
}

// Toggle favorite state
export async function toggleFavorite(quoteId: string): Promise<{ isFavorited: boolean; message: string }> {
    const db = await getDatabase();
    const alreadyFavorited = await isFavorited(quoteId);

    if (alreadyFavorited) {
        // Remove from favorites
        await db.runAsync('DELETE FROM favorites WHERE quote_id = ?', [quoteId]);
        return { isFavorited: false, message: 'Removed from favorites' };
    } else {
        // Add to favorites
        const timestamp = new Date().toISOString();
        await db.runAsync(
            'INSERT INTO favorites (quote_id, saved_at) VALUES (?, ?)',
            [quoteId, timestamp]
        );
        return { isFavorited: true, message: 'Added to favorites' };
    }
}

// Add quote to favorites
export async function addFavorite(quoteId: string): Promise<void> {
    const db = await getDatabase();
    const timestamp = new Date().toISOString();

    await db.runAsync(
        'INSERT OR IGNORE INTO favorites (quote_id, saved_at) VALUES (?, ?)',
        [quoteId, timestamp]
    );
}

// Remove quote from favorites
export async function removeFavorite(quoteId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM favorites WHERE quote_id = ?', [quoteId]);
}

// Get all favorited quotes
export async function getFavorites(): Promise<FavoriteQuote[]> {
    const db = await getDatabase();

    const results = await db.getAllAsync<{
        quote_id: string;
        saved_at: string;
        text: string;
        author: string;
        category: string | null;
        month: number | null;
        weekday: number | null;
        holiday: string | null;
        weight: number | null;
    }>(
        `SELECT f.quote_id, f.saved_at, q.text, q.author, q.category, q.month, q.weekday, q.holiday, q.weight
         FROM favorites f
         JOIN quotes q ON f.quote_id = q.id
         ORDER BY f.saved_at DESC`
    );

    return results.map((row) => ({
        id: row.quote_id,
        text: row.text,
        author: row.author,
        category: row.category ?? undefined,
        month: row.month ?? undefined,
        weekday: row.weekday ?? undefined,
        holiday: row.holiday ?? undefined,
        weight: row.weight ?? undefined,
        savedAt: row.saved_at,
    }));
}

// Get favorites count
export async function getFavoritesCount(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM favorites');
    return result?.count ?? 0;
}
