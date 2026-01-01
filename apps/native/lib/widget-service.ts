import { NativeModules, Platform } from 'react-native';

interface QuoteWidgetModuleInterface {
    refreshWidget(): Promise<boolean>;
    isWidgetActive(): Promise<boolean>;
    getWidgetCount(): Promise<number>;
    requestWidgetPin(): Promise<boolean>;
    scheduleUpdates(): Promise<boolean>;
}

// Get the native module (Android only)
const QuoteWidgetNativeModule = Platform.OS === 'android'
    ? NativeModules.QuoteWidgetModule
    : null;

/**
 * Widget Service
 * Provides methods to interact with the Android home screen widget
 */
export const WidgetService = {
    /**
     * Check if the widget feature is available (Android only)
     */
    isAvailable(): boolean {
        return Platform.OS === 'android' && QuoteWidgetNativeModule != null;
    },

    /**
     * Refresh all widget instances with the latest quote
     * Call this after the daily quote changes
     */
    async refreshWidget(): Promise<boolean> {
        if (!this.isAvailable()) {
            console.log('Widget service not available on this platform');
            return false;
        }

        try {
            return await QuoteWidgetNativeModule.refreshWidget();
        } catch (error) {
            console.error('Error refreshing widget:', error);
            return false;
        }
    },

    /**
     * Check if user has at least one widget on their home screen
     */
    async isWidgetActive(): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            return await QuoteWidgetNativeModule.isWidgetActive();
        } catch (error) {
            console.error('Error checking widget status:', error);
            return false;
        }
    },

    /**
     * Get the number of widget instances on the home screen
     */
    async getWidgetCount(): Promise<number> {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            return await QuoteWidgetNativeModule.getWidgetCount();
        } catch (error) {
            console.error('Error getting widget count:', error);
            return 0;
        }
    },

    /**
     * Request to pin the widget to the home screen (Android 8.0+)
     * Opens system dialog for user to confirm widget placement
     */
    async requestWidgetPin(): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            return await QuoteWidgetNativeModule.requestWidgetPin();
        } catch (error) {
            console.error('Error requesting widget pin:', error);
            return false;
        }
    },

    /**
     * Schedule daily widget updates
     * Call this on app start to ensure updates are scheduled
     */
    async scheduleUpdates(): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            return await QuoteWidgetNativeModule.scheduleUpdates();
        } catch (error) {
            console.error('Error scheduling widget updates:', error);
            return false;
        }
    },

    /**
     * Open system widget picker instructions
     * Shows user how to add widget from home screen
     */
    showWidgetInstructions(): string[] {
        if (Platform.OS === 'android') {
            return [
                'Long-press on an empty area of your home screen',
                'Tap "Widgets" from the menu that appears',
                'Find "myquo - Daily Quote" in the list',
                'Long-press and drag it to your desired position',
                'Release to place the widget',
            ];
        }

        return ['Widget is only available on Android'];
    },
};

export default WidgetService;
