const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin for myquo Home Screen Widget
 * This plugin adds the necessary Android configuration for the home screen widget
 */

const withQuoteWidget = (config) => {
    // Add widget receiver to AndroidManifest.xml
    config = withAndroidManifest(config, (config) => {
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

        // Add the widget provider receiver
        const widgetReceiver = {
            $: {
                'android:name': '.widget.QuoteWidgetProvider',
                'android:exported': 'true',
            },
            'intent-filter': [
                {
                    action: [
                        {
                            $: {
                                'android:name': 'android.appwidget.action.APPWIDGET_UPDATE',
                            },
                        },
                    ],
                },
            ],
            'meta-data': [
                {
                    $: {
                        'android:name': 'android.appwidget.provider',
                        'android:resource': '@xml/quote_widget_info',
                    },
                },
            ],
        };

        // Check if receiver already exists
        if (!mainApplication.receiver) {
            mainApplication.receiver = [];
        }

        const existingReceiver = mainApplication.receiver.find(
            (r) => r.$['android:name'] === '.widget.QuoteWidgetProvider'
        );

        if (!existingReceiver) {
            mainApplication.receiver.push(widgetReceiver);
        }

        return config;
    });

    // Copy native widget files
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const projectRoot = config.modRequest.projectRoot;
            const androidPath = path.join(projectRoot, 'android');

            // Create widget directory structure
            const packageName = config.android?.package || 'com.myquo';
            const packagePath = packageName.replace(/\./g, '/');

            const widgetDir = path.join(
                androidPath,
                'app/src/main/java',
                packagePath,
                'widget'
            );
            const resXmlDir = path.join(androidPath, 'app/src/main/res/xml');
            const resLayoutDir = path.join(androidPath, 'app/src/main/res/layout');
            const resDrawableDir = path.join(androidPath, 'app/src/main/res/drawable');

            // Create directories
            await fs.promises.mkdir(widgetDir, { recursive: true });
            await fs.promises.mkdir(resXmlDir, { recursive: true });
            await fs.promises.mkdir(resLayoutDir, { recursive: true });
            await fs.promises.mkdir(resDrawableDir, { recursive: true });

            // Copy widget files from plugin assets
            const pluginAssetsDir = path.join(projectRoot, 'plugins/widget/android');

            if (fs.existsSync(pluginAssetsDir)) {
                // Copy Kotlin files
                const kotlinFiles = ['QuoteWidgetProvider.kt', 'QuoteUpdateWorker.kt', 'WidgetDataHelper.kt'];
                for (const file of kotlinFiles) {
                    const src = path.join(pluginAssetsDir, 'kotlin', file);
                    const dest = path.join(widgetDir, file);
                    if (fs.existsSync(src)) {
                        let content = await fs.promises.readFile(src, 'utf8');
                        content = content.replace(/PACKAGE_NAME/g, packageName);
                        await fs.promises.writeFile(dest, content);
                    }
                }

                // Copy XML files
                const xmlFiles = ['quote_widget_info.xml'];
                for (const file of xmlFiles) {
                    const src = path.join(pluginAssetsDir, 'xml', file);
                    const dest = path.join(resXmlDir, file);
                    if (fs.existsSync(src)) {
                        await fs.promises.copyFile(src, dest);
                    }
                }

                // Copy layout files
                const layoutFiles = ['widget_quote.xml'];
                for (const file of layoutFiles) {
                    const src = path.join(pluginAssetsDir, 'layout', file);
                    const dest = path.join(resLayoutDir, file);
                    if (fs.existsSync(src)) {
                        await fs.promises.copyFile(src, dest);
                    }
                }

                // Copy drawable files
                const drawableFiles = ['widget_background.xml', 'widget_background_dark.xml'];
                for (const file of drawableFiles) {
                    const src = path.join(pluginAssetsDir, 'drawable', file);
                    const dest = path.join(resDrawableDir, file);
                    if (fs.existsSync(src)) {
                        await fs.promises.copyFile(src, dest);
                    }
                }
            }

            return config;
        },
    ]);

    return config;
};

module.exports = withQuoteWidget;
