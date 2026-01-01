import { View, StyleSheet, useColorScheme, ScrollView, Pressable, RefreshControl } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useState, useEffect, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';
import { FavoriteQuote } from '@/lib/database';
import { getFavorites, removeFavorite } from '@/lib/favorites-service';
import { shareQuote, copyQuoteToClipboard } from '@/lib/share-service';
import { useToast } from '@/components/toast';

export default function Favorites() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { showToast, ToastComponent } = useToast();

    const loadFavorites = useCallback(async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (err) {
            console.error('Error loading favorites:', err);
            showToast('Failed to load favorites', 'error');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadFavorites();
    }, [loadFavorites]);

    const handleRemoveFavorite = async (quoteId: string) => {
        try {
            await removeFavorite(quoteId);
            setFavorites((prev) => prev.filter((q) => q.id !== quoteId));
            showToast('Removed from favorites', 'success');
        } catch (err) {
            console.error('Error removing favorite:', err);
            showToast('Failed to remove favorite', 'error');
        }
    };

    const handleShare = async (quote: FavoriteQuote) => {
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

    const handleCopy = async (quote: FavoriteQuote) => {
        try {
            const result = await copyQuoteToClipboard(quote);
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (err) {
            console.error('Error copying:', err);
            showToast('Failed to copy quote', 'error');
        }
    };

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

            {isEmpty && !isLoading ? (
                <EmptyState isDark={isDark} />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={isDark ? '#6366F1' : '#6366F1'}
                        />
                    }
                >
                    {favorites.map((quote, index) => (
                        <FavoriteCard
                            key={quote.id}
                            quote={quote}
                            index={index}
                            isDark={isDark}
                            onRemove={() => handleRemoveFavorite(quote.id)}
                            onShare={() => handleShare(quote)}
                            onCopy={() => handleCopy(quote)}
                        />
                    ))}
                </ScrollView>
            )}

            {/* Toast */}
            <ToastComponent />
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
    onRemove: () => void;
    onShare: () => void;
    onCopy: () => void;
}

function FavoriteCard({ quote, index, isDark, onRemove, onShare, onCopy }: FavoriteCardProps) {
    const [showActions, setShowActions] = useState(false);

    const iconColor = isDark ? '#9CA3AF' : '#6B7280';
    const savedDate = new Date(quote.savedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
        >
            <Pressable
                onPress={() => setShowActions(!showActions)}
                style={[
                    styles.favoriteCard,
                    { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
                ]}
            >
                <View style={styles.cardContent}>
                    <MotiText
                        style={[
                            styles.favoriteQuoteText,
                            { color: isDark ? '#F9FAFB' : '#111827' },
                        ]}
                        numberOfLines={showActions ? undefined : 3}
                    >
                        "{quote.text}"
                    </MotiText>
                    <View style={styles.cardMeta}>
                        <MotiText
                            style={[
                                styles.favoriteAuthor,
                                { color: isDark ? '#9CA3AF' : '#6B7280' },
                            ]}
                        >
                            — {quote.author}
                        </MotiText>
                        <MotiText
                            style={[
                                styles.savedDate,
                                { color: isDark ? '#6B7280' : '#9CA3AF' },
                            ]}
                        >
                            Saved {savedDate}
                        </MotiText>
                    </View>
                </View>

                {/* Action Buttons */}
                <MotiView
                    animate={{
                        height: showActions ? 48 : 0,
                        opacity: showActions ? 1 : 0,
                    }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={styles.actionsRow}
                >
                    <Pressable onPress={onShare} style={styles.actionBtn}>
                        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                        <MotiText style={[styles.actionBtnText, { color: iconColor }]}>
                            Share
                        </MotiText>
                    </Pressable>

                    <Pressable onPress={onCopy} style={styles.actionBtn}>
                        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                        <MotiText style={[styles.actionBtnText, { color: iconColor }]}>
                            Copy
                        </MotiText>
                    </Pressable>

                    <Pressable onPress={onRemove} style={styles.actionBtn}>
                        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                stroke="#EF4444"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                        <MotiText style={[styles.actionBtnText, { color: '#EF4444' }]}>
                            Remove
                        </MotiText>
                    </Pressable>
                </MotiView>
            </Pressable>
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
    cardContent: {
        flex: 1,
    },
    favoriteQuoteText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    },
    cardMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoriteAuthor: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    savedDate: {
        fontSize: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#374151',
        overflow: 'hidden',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
});
