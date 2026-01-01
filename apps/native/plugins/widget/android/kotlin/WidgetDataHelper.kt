package PACKAGE_NAME.widget

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import java.io.File
import java.util.Calendar

/**
 * Helper class to read quote data from SQLite database
 * Shared with the React Native app
 */
class WidgetDataHelper(private val context: Context) {

    data class QuoteData(
        val id: String,
        val text: String,
        val author: String
    )

    private val defaultQuote = QuoteData(
        id = "default",
        text = "Open the app to get your daily inspiration",
        author = "myquo"
    )

    /**
     * Get today's quote from the database
     */
    fun getTodayQuote(): QuoteData {
        return try {
            val dbPath = getDatabasePath()
            if (!File(dbPath).exists()) {
                return defaultQuote
            }

            val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
            val quote = queryTodayQuote(db)
            db.close()
            quote ?: selectQuoteFromCandidates(dbPath)
        } catch (e: Exception) {
            e.printStackTrace()
            defaultQuote
        }
    }

    /**
     * Get the path to the SQLite database
     */
    private fun getDatabasePath(): String {
        // Expo SQLite stores databases in the app's files directory
        val filesDir = context.filesDir
        return File(filesDir, "SQLite/myquo.db").absolutePath
    }

    /**
     * Query for today's quote from history
     */
    private fun queryTodayQuote(db: SQLiteDatabase): QuoteData? {
        val today = getTodayDateString()
        
        val cursor = db.rawQuery(
            """
            SELECT q.id, q.text, q.author 
            FROM history h 
            JOIN quotes q ON h.quote_id = q.id 
            WHERE h.date = ?
            """,
            arrayOf(today)
        )

        return if (cursor.moveToFirst()) {
            val quote = QuoteData(
                id = cursor.getString(0),
                text = cursor.getString(1),
                author = cursor.getString(2)
            )
            cursor.close()
            quote
        } else {
            cursor.close()
            null
        }
    }

    /**
     * Select a quote using deterministic algorithm (fallback if not in history)
     */
    private fun selectQuoteFromCandidates(dbPath: String): QuoteData {
        return try {
            val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
            
            val calendar = Calendar.getInstance()
            val weekday = calendar.get(Calendar.DAY_OF_WEEK) - 1 // 0-6
            val month = calendar.get(Calendar.MONTH) + 1 // 1-12
            
            // Query candidates
            val cursor = db.rawQuery(
                """
                SELECT id, text, author, weight FROM quotes 
                WHERE (month = ? OR month IS NULL) 
                AND (weekday = ? OR weekday IS NULL) 
                AND holiday IS NULL
                ORDER BY 
                    CASE WHEN month = ? AND weekday = ? THEN 4
                         WHEN month = ? THEN 3
                         WHEN weekday = ? THEN 2
                         ELSE 1 END DESC
                """,
                arrayOf(
                    month.toString(), weekday.toString(),
                    month.toString(), weekday.toString(),
                    month.toString(), weekday.toString()
                )
            )

            val candidates = mutableListOf<QuoteData>()
            while (cursor.moveToNext()) {
                candidates.add(
                    QuoteData(
                        id = cursor.getString(0),
                        text = cursor.getString(1),
                        author = cursor.getString(2)
                    )
                )
            }
            cursor.close()
            db.close()

            if (candidates.isEmpty()) {
                defaultQuote
            } else {
                // Deterministic selection based on date
                val dateHash = getTodayDateString().hashCode()
                val index = Math.abs(dateHash) % candidates.size
                candidates[index]
            }
        } catch (e: Exception) {
            e.printStackTrace()
            defaultQuote
        }
    }

    /**
     * Get today's date as YYYY-MM-DD string
     */
    private fun getTodayDateString(): String {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH) + 1
        val day = calendar.get(Calendar.DAY_OF_MONTH)
        return String.format("%04d-%02d-%02d", year, month, day)
    }

    /**
     * Get the device seed for deterministic selection
     */
    private fun getDeviceSeed(): String {
        val prefs = context.getSharedPreferences("myquo_prefs", Context.MODE_PRIVATE)
        var seed = prefs.getString("device_seed", null)
        
        if (seed == null) {
            seed = java.util.UUID.randomUUID().toString()
            prefs.edit().putString("device_seed", seed).apply()
        }
        
        return seed
    }
}
