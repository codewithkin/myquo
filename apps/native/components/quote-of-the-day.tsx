import { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    useColorScheme,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { MotiView, MotiText } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { Quote } from '@/lib/database';
import { getTodayQuote, getQuoteContext } from '@/lib/quote-service';
import { toggleFavorite, isFavorited } from '@/lib/favorites-service';
import { shareQuote, copyQuoteToClipboard } from '@/lib/share-service';
import { useToast } from '@/components/toast';

interface QuoteOfTheDayProps {
    onFavoriteChange?: (quoteId: string, isFavorited: boolean) => void;
}

export function QuoteOfTheDay({ onFavoriteChange }: QuoteOfTheDayProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [quote, setQuote] = useState<Quote | null>(null);
    const [favorited, setFavorited] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { showToast, ToastComponent } = useToast();

    // Load today's quote
    const loadQuote = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const context = getQuoteContext();
            const todayQuote = await getTodayQuote(context);

            if (todayQuote) {
                setQuote(todayQuote);
                const isFav = await isFavorited(todayQuote.id);
                setFavorited(isFav);
            } else {
                setError('No quotes available');
            }
        } catch (err) {
            console.error('Error loading quote:', err);
            setError('Failed to load quote');
        } finally {
            setIsLoading(false);
            // Trigger entrance animation after a brief delay
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, []);

    useEffect(() => {
        loadQuote();
    }, [loadQuote]);

    const handleFavorite = async () => {
        if (!quote) return;

        try {
            const result = await toggleFavorite(quote.id);
            setFavorited(result.isFavorited);
            showToast(result.message, 'success');
            onFavoriteChange?.(quote.id, result.isFavorited);
        } catch (err) {
            console.error('Error toggling favorite:', err);
            showToast('Failed to update favorite', 'error');
        }
    };

    const handleShare = async () => {
        if (!quote) return;

        try {
            const result = await shareQuote(quote);
            if (!result.success && result.message) {
                showToast(result.message, 'info');
            }
        } catch (err) {
            console.error('Error sharing:', err);
            showToast('Failed to share quote', 'error');
        }
    };

    const handleCopy = async () => {
        if (!quote) return;

        try {
            const result = await copyQuoteToClipboard(quote);
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (err) {
            console.error('Error copying:', err);
            showToast('Failed to copy quote', 'error');
        }
    };

    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    if (error || !quote) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <MotiText
                    style={[
                        styles.errorText,
                        { color: isDark ? '#EF4444' : '#DC2626' },
                    ]}
                >
                    {error || 'Something went wrong'}
                </MotiText>
                <Pressable onPress={loadQuote} style={styles.retryButton}>
                    <MotiText style={styles.retryButtonText}>Retry</MotiText>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Date Header */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: isLoaded ? 1 : 0, translateY: isLoaded ? 0 : -20 }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.dateContainer}
            >
                <MotiText
                    style={[
                        styles.dateText,
                        { color: isDark ? '#9CA3AF' : '#6B7280' },
                    ]}
                >
                    {dateString}
                </MotiText>
            </MotiView>

            {/* Quote Card */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: isLoaded ? 1 : 0.9,
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    delay: 200,
                }}
                style={[
                    styles.quoteCard,
                    {
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        shadowColor: isDark ? '#000000' : '#6366F1',
                    },
                ]}
            >
                {/* Quote Mark */}
                <MotiView
                    from={{ scale: 0, rotate: '-45deg' }}
                    animate={{ scale: isLoaded ? 1 : 0, rotate: isLoaded ? '0deg' : '-45deg' }}
                    transition={{ type: 'spring', damping: 15, delay: 400 }}
                    style={styles.quoteMarkContainer}
                >
                    <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V15C10 16.0609 9.57857 17.0783 8.82843 17.8284C8.07828 18.5786 7.06087 19 6 19"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d="M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V15C20 16.0609 19.5786 17.0783 18.8284 17.8284C18.0783 18.5786 17.0609 19 16 19"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </MotiView>

                {/* Quote Text */}
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        translateY: isLoaded ? 0 : 30,
                    }}
                    transition={{ type: 'timing', duration: 600, delay: 500 }}
                >
                    <MotiText
                        style={[
                            styles.quoteText,
                            { color: isDark ? '#F9FAFB' : '#111827' },
                        ]}
                    >
                        {quote.text}
                    </MotiText>
                </MotiView>

                {/* Author */}
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        translateX: isLoaded ? 0 : -20,
                    }}
                    transition={{ type: 'timing', duration: 500, delay: 700 }}
                >
                    <MotiText
                        style={[
                            styles.authorText,
                            { color: isDark ? '#9CA3AF' : '#6B7280' },
                        ]}
                    >
                        — {quote.author}
                    </MotiText>
                </MotiView>
            </MotiView>

            {/* Action Buttons */}
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                    translateY: isLoaded ? 0 : 30,
                }}
                transition={{ type: 'spring', damping: 20, delay: 800 }}
                style={styles.actionsContainer}
            >
                {/* Favorite Button */}
                <ActionButton
                    icon={favorited ? 'heart-filled' : 'heart'}
                    label={favorited ? 'Saved' : 'Save'}
                    onPress={handleFavorite}
                    isActive={favorited}
                    isDark={isDark}
                />

                {/* Share Button */}
                <ActionButton
                    icon="share"
                    label="Share"
                    onPress={handleShare}
                    isDark={isDark}
                />

                {/* Copy Button */}
                <ActionButton
                    icon="copy"
                    label="Copy"
                    onPress={handleCopy}
                    isDark={isDark}
                />
            </MotiView>

            {/* Branding */}
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 0.5 : 0 }}
                transition={{ type: 'timing', duration: 500, delay: 1000 }}
                style={styles.brandingContainer}
            >
                <MotiText
                    style={[
                        styles.brandingText,
                        { color: isDark ? '#4B5563' : '#9CA3AF' },
                    ]}
                >
                    myquo
                </MotiText>
            </MotiView>

            {/* Toast */}
            <ToastComponent />
        </View>
    );
}

// Action Button Component
interface ActionButtonProps {
    icon: 'heart' | 'heart-filled' | 'share' | 'copy';
    label: string;
    onPress: () => void;
    isActive?: boolean;
    isDark: boolean;
}

function ActionButton({ icon, label, onPress, isActive = false, isDark }: ActionButtonProps) {
    const [isPressed, setIsPressed] = useState(false);

    const iconColor = isActive ? '#EF4444' : isDark ? '#9CA3AF' : '#6B7280';

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            <MotiView
                animate={{
                    scale: isPressed ? 0.9 : 1,
                    backgroundColor: isPressed
                        ? isDark
                            ? '#374151'
                            : '#F3F4F6'
                        : 'transparent',
                }}
                transition={{ type: 'timing', duration: 100 }}
                style={styles.actionButton}
            >
                <MotiView
                    animate={{
                        scale: isActive ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ type: 'timing', duration: 300 }}
                >
                    {icon === 'heart' && (
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    )}
                    {icon === 'heart-filled' && (
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill={iconColor}>
                            <Path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    )}
                    {icon === 'share' && (
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    )}
                    {icon === 'copy' && (
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    )}
                </MotiView>
                <MotiText
                    style={[
                        styles.actionLabel,
                        { color: isActive ? '#EF4444' : isDark ? '#9CA3AF' : '#6B7280' },
                    ]}
                >
                    {label}
                </MotiText>
            </MotiView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dateContainer: {
        marginBottom: 24,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    quoteCard: {
        width: '100%',
        padding: 32,
        borderRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    quoteMarkContainer: {
        marginBottom: 16,
    },
    quoteText: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 36,
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    authorText: {
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        marginTop: 32,
    },
    actionButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        minWidth: 64,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    brandingContainer: {
        position: 'absolute',
        bottom: 24,
    },
    brandingText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
    },
});
