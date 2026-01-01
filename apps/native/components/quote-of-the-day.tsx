import { useState, useEffect, useMemo } from 'react';
import {
    View,
    StyleSheet,
    useColorScheme,
    Pressable,
    Share,
} from 'react-native';
import { MotiView, MotiText } from 'moti';
import Svg, { Path } from 'react-native-svg';

interface Quote {
    id: string;
    text: string;
    author: string;
}

// Sample quotes for now - will be replaced with SQLite database
const SAMPLE_QUOTES: Quote[] = [
    {
        id: 'q001',
        text: 'Your limitation—it\'s only your imagination.',
        author: 'Unknown',
    },
    {
        id: 'q002',
        text: 'Push yourself, because no one else is going to do it for you.',
        author: 'Unknown',
    },
    {
        id: 'q003',
        text: 'Great things never come from comfort zones.',
        author: 'Unknown',
    },
    {
        id: 'q004',
        text: 'Dream it. Wish it. Do it.',
        author: 'Unknown',
    },
    {
        id: 'q005',
        text: 'Success doesn\'t just find you. You have to go out and get it.',
        author: 'Unknown',
    },
    {
        id: 'q006',
        text: 'The harder you work for something, the greater you\'ll feel when you achieve it.',
        author: 'Unknown',
    },
    {
        id: 'q007',
        text: 'Don\'t stop when you\'re tired. Stop when you\'re done.',
        author: 'Unknown',
    },
];

interface QuoteOfTheDayProps {
    onFavorite?: (quote: Quote) => void;
    isFavorited?: boolean;
}

export function QuoteOfTheDay({ onFavorite, isFavorited = false }: QuoteOfTheDayProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [isLoaded, setIsLoaded] = useState(false);
    const [favorited, setFavorited] = useState(isFavorited);
    const [showCopied, setShowCopied] = useState(false);

    // Deterministic quote selection based on date
    const todayQuote = useMemo(() => {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

        // Simple hash for deterministic selection
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            const char = dateString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        const index = Math.abs(hash) % SAMPLE_QUOTES.length;
        return SAMPLE_QUOTES[index];
    }, []);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleFavorite = () => {
        setFavorited(!favorited);
        onFavorite?.(todayQuote);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `"${todayQuote.text}"\n— ${todayQuote.author}\n\nShared from myquo`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleCopy = async () => {
        // In a real app, use Clipboard API
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

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
                    scale: isLoaded ? 1 : 0.9
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    delay: 200
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
                            stroke={isDark ? '#6366F1' : '#6366F1'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d="M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V15C20 16.0609 19.5786 17.0783 18.8284 17.8284C18.0783 18.5786 17.0609 19 16 19"
                            stroke={isDark ? '#6366F1' : '#6366F1'}
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
                        translateY: isLoaded ? 0 : 30
                    }}
                    transition={{ type: 'timing', duration: 600, delay: 500 }}
                >
                    <MotiText
                        style={[
                            styles.quoteText,
                            { color: isDark ? '#F9FAFB' : '#111827' },
                        ]}
                    >
                        {todayQuote.text}
                    </MotiText>
                </MotiView>

                {/* Author */}
                <MotiView
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        translateX: isLoaded ? 0 : -20
                    }}
                    transition={{ type: 'timing', duration: 500, delay: 700 }}
                >
                    <MotiText
                        style={[
                            styles.authorText,
                            { color: isDark ? '#9CA3AF' : '#6B7280' },
                        ]}
                    >
                        — {todayQuote.author}
                    </MotiText>
                </MotiView>
            </MotiView>

            {/* Action Buttons */}
            <MotiView
                from={{ opacity: 0, translateY: 30 }}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                    translateY: isLoaded ? 0 : 30
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
                    label={showCopied ? 'Copied!' : 'Copy'}
                    onPress={handleCopy}
                    isActive={showCopied}
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
