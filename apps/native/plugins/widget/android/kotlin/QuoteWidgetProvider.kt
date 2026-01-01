package PACKAGE_NAME.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import androidx.work.*
import java.util.concurrent.TimeUnit
import java.util.Calendar
import PACKAGE_NAME.R
import PACKAGE_NAME.MainActivity

/**
 * Quote Widget Provider
 * Handles the home screen widget for displaying daily quotes
 */
class QuoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // Update each widget instance
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // First widget added - schedule daily updates
        scheduleQuoteUpdate(context)
    }

    override fun onDisabled(context: Context) {
        // Last widget removed - cancel scheduled updates
        cancelQuoteUpdate(context)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        // Handle custom refresh action
        if (intent.action == ACTION_REFRESH_WIDGET) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            onUpdate(context, appWidgetManager, appWidgetIds)
        }
    }

    companion object {
        const val ACTION_REFRESH_WIDGET = "PACKAGE_NAME.widget.ACTION_REFRESH_WIDGET"
        private const val WORK_NAME = "quote_widget_update"

        /**
         * Update a specific widget instance
         */
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            // Get quote data
            val helper = WidgetDataHelper(context)
            val quoteData = helper.getTodayQuote()

            // Create RemoteViews
            val views = RemoteViews(context.packageName, R.layout.widget_quote)

            // Set quote text and author
            views.setTextViewText(R.id.widget_quote_text, "\"${quoteData.text}\"")
            views.setTextViewText(R.id.widget_author_text, "— ${quoteData.author}")

            // Set click intent to open app
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                data = android.net.Uri.parse("myquo://quote/today")
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        /**
         * Update all widget instances
         */
        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            
            for (appWidgetId in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, appWidgetId)
            }
        }

        /**
         * Schedule daily widget updates using WorkManager
         */
        fun scheduleQuoteUpdate(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiresBatteryNotLow(false)
                .build()

            // Calculate delay until next midnight
            val currentTime = System.currentTimeMillis()
            val calendar = Calendar.getInstance().apply {
                timeInMillis = currentTime
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                add(Calendar.DAY_OF_YEAR, 1)
            }
            val delayMillis = calendar.timeInMillis - currentTime

            val updateRequest = PeriodicWorkRequestBuilder<QuoteUpdateWorker>(
                24, TimeUnit.HOURS
            )
                .setConstraints(constraints)
                .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.REPLACE,
                updateRequest
            )
        }

        /**
         * Schedule daily widget updates at a specific time
         */
        fun scheduleQuoteUpdateAtTime(context: Context, hour: Int, minute: Int) {
            val constraints = Constraints.Builder()
                .setRequiresBatteryNotLow(false)
                .build()

            // Calculate delay until the next occurrence of the specified time
            val currentTime = System.currentTimeMillis()
            val calendar = Calendar.getInstance().apply {
                timeInMillis = currentTime
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                
                // If the time has already passed today, schedule for tomorrow
                if (timeInMillis <= currentTime) {
                    add(Calendar.DAY_OF_YEAR, 1)
                }
            }
            val delayMillis = calendar.timeInMillis - currentTime

            val updateRequest = PeriodicWorkRequestBuilder<QuoteUpdateWorker>(
                24, TimeUnit.HOURS
            )
                .setConstraints(constraints)
                .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.REPLACE,
                updateRequest
            )
        }

        /**
         * Cancel scheduled widget updates
         */
        fun cancelQuoteUpdate(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME)
        }
    }
}
