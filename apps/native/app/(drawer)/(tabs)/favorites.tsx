import { View, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';

interface FavoriteQuote {
    id: string;
    text: string;
    author: string;
    savedAt: Date;
}

// Sample favorites for now - will be replaced with SQLite
const SAMPLE_FAVORITES: FavoriteQuote[] = [];

export default function Favorites() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [favorites, setFavorites] = useState<FavoriteQuote[]>(SAMPLE_FAVORITES);

    const isEmpty = favorites.length === 0;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isDark ? '#111827' : '#F9FAFB' },
            ]}
        >
            {/* Header */}
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.header}
            >
                <MotiText
                    style={[
                        styles.headerTitle,
                        { color: isDark ? '#FFFFFF' : '#111827' },
                    ]}
                >
                    Favorites
                </MotiText>
                <MotiText
                    style={[
                        styles.headerSubtitle,
                        { color: isDark ? '#9CA3AF' : '#6B7280' },
                    ]}
                >
                    {isEmpty
                        ? 'Your saved quotes will appear here'
                        : `${favorites.length} saved quote${favorites.length !== 1 ? 's' : ''}`}
                </MotiText>
            </MotiView>

            {isEmpty ? (
                <EmptyState isDark={isDark} />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {favorites.map((quote, index) => (
                        <FavoriteCard
                            key={quote.id}
                            quote={quote}
                            index={index}
                            isDark={isDark}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

// Empty State Component
function EmptyState({ isDark }: { isDark: boolean }) {
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, delay: 300 }}
            style={styles.emptyContainer}
        >
            {/* Heart Icon */}
            <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 400 }}
                style={[
                    styles.emptyIconContainer,
                    { backgroundColor: isDark ? '#1F2937' : '#FEE2E2' },
                ]}
            >
                <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <Path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke={isDark ? '#F87171' : '#EF4444'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </MotiView>

            <MotiText
                style={[
                    styles.emptyTitle,
                    { color: isDark ? '#FFFFFF' : '#111827' },
                ]}
            >
                No favorites yet
            </MotiText>
            <MotiText
                style={[
                    styles.emptyDescription,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
            >
                Tap the heart icon on a quote to save it here
            </MotiText>
        </MotiView>
    );
}

// Favorite Card Component
interface FavoriteCardProps {
    quote: FavoriteQuote;
    index: number;
    isDark: boolean;
}

function FavoriteCard({ quote, index, isDark }: FavoriteCardProps) {
    return (
        <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
            style={[
                styles.favoriteCard,
                { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            ]}
        >
            <MotiText
                style={[
                    styles.favoriteQuoteText,
                    { color: isDark ? '#F9FAFB' : '#111827' },
                ]}
                numberOfLines={3}
            >
                "{quote.text}"
            </MotiText>
            <MotiText
                style={[
                    styles.favoriteAuthor,
                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                ]}
            >
                — {quote.author}
            </MotiText>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 48,
    },
    emptyIconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    favoriteCard: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    favoriteQuoteText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    },
    favoriteAuthor: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});
