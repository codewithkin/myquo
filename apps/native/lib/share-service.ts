import { Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Quote } from './database';

// Format quote for sharing
function formatQuoteText(quote: Quote): string {
    return `"${quote.text}"\n— ${quote.author}\n\nShared from myquo`;
}

// Format quote for clipboard (without app branding)
function formatQuoteForClipboard(quote: Quote): string {
    return `"${quote.text}"\n— ${quote.author}`;
}

// Share a quote using native share sheet
export async function shareQuote(quote: Quote): Promise<{ success: boolean; message?: string }> {
    try {
        const message = formatQuoteText(quote);

        const result = await Share.share(
            {
                message,
                // iOS-specific: title shown in share sheet
                title: 'Share Quote',
            },
            {
                // Android-specific: dialog title
                dialogTitle: 'Share this quote',
            }
        );

        if (result.action === Share.sharedAction) {
            // Shared successfully
            return { success: true };
        } else if (result.action === Share.dismissedAction) {
            // Share cancelled (iOS only)
            return { success: false, message: 'Share cancelled' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sharing quote:', error);

        // Handle specific error cases
        if (error instanceof Error) {
            if (error.message.includes('No activity found')) {
                return { success: false, message: 'No apps available to share' };
            }
        }

        return { success: false, message: 'Failed to share quote' };
    }
}

// Copy quote to clipboard
export async function copyQuoteToClipboard(quote: Quote): Promise<{ success: boolean; message: string }> {
    try {
        const text = formatQuoteForClipboard(quote);
        await Clipboard.setStringAsync(text);
        return { success: true, message: 'Copied!' };
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return { success: false, message: 'Failed to copy' };
    }
}

// Get clipboard content (for paste detection if needed)
export async function getClipboardContent(): Promise<string | null> {
    try {
        const hasString = await Clipboard.hasStringAsync();
        if (hasString) {
            return await Clipboard.getStringAsync();
        }
        return null;
    } catch (error) {
        console.error('Error reading clipboard:', error);
        return null;
    }
}
