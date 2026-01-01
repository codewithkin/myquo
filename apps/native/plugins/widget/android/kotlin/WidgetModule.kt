package PACKAGE_NAME.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

/**
 * React Native bridge module for widget communication
 */
class WidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "QuoteWidgetModule"

    /**
     * Trigger a widget refresh from React Native
     */
    @ReactMethod
    fun refreshWidget(promise: Promise) {
        try {
            val context = reactApplicationContext
            QuoteWidgetProvider.updateAllWidgets(context)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", "Failed to refresh widget: ${e.message}")
        }
    }

    /**
     * Check if widget is currently on home screen
     */
    @ReactMethod
    fun isWidgetActive(promise: Promise) {
        try {
            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
            val widgetIds = appWidgetManager.getAppWidgetIds(componentName)
            promise.resolve(widgetIds.isNotEmpty())
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", "Failed to check widget status: ${e.message}")
        }
    }

    /**
     * Get the count of active widgets
     */
    @ReactMethod
    fun getWidgetCount(promise: Promise) {
        try {
            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
            val widgetIds = appWidgetManager.getAppWidgetIds(componentName)
            promise.resolve(widgetIds.size)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", "Failed to get widget count: ${e.message}")
        }
    }

    /**
     * Request widget pin (Android 8.0+)
     */
    @ReactMethod
    fun requestWidgetPin(promise: Promise) {
        try {
            val context = reactApplicationContext
            val appWidgetManager = AppWidgetManager.getInstance(context)
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                val componentName = ComponentName(context, QuoteWidgetProvider::class.java)
                
                if (appWidgetManager.isRequestPinAppWidgetSupported) {
                    appWidgetManager.requestPinAppWidget(componentName, null, null)
                    promise.resolve(true)
                } else {
                    promise.resolve(false)
                }
            } else {
                // For older Android versions, just return false
                promise.resolve(false)
            }
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", "Failed to request widget pin: ${e.message}")
        }
    }

    /**
     * Schedule/reschedule widget updates
     */
    @ReactMethod
    fun scheduleUpdates(promise: Promise) {
        try {
            val context = reactApplicationContext
            QuoteWidgetProvider.scheduleQuoteUpdate(context)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_ERROR", "Failed to schedule updates: ${e.message}")
        }
    }
}
