import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useEffect, useState, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
    duration?: number;
    type?: 'success' | 'error' | 'info';
}

export function Toast({
    message,
    visible,
    onHide,
    duration = 2000,
    type = 'success',
}: ToastProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onHide();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, duration, onHide]);

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return isDark ? '#065F46' : '#D1FAE5';
            case 'error':
                return isDark ? '#7F1D1D' : '#FEE2E2';
            case 'info':
            default:
                return isDark ? '#1F2937' : '#F3F4F6';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return isDark ? '#A7F3D0' : '#065F46';
            case 'error':
                return isDark ? '#FCA5A5' : '#7F1D1D';
            case 'info':
            default:
                return isDark ? '#F9FAFB' : '#111827';
        }
    };

    const getIcon = () => {
        const iconColor = getTextColor();
        switch (type) {
            case 'success':
                return (
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M20 6L9 17l-5-5"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                );
            case 'error':
                return (
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M18 6L6 18M6 6l12 12"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                );
            case 'info':
            default:
                return (
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M12 16v-4M12 8h.01"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                            stroke={iconColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                );
        }
    };

    return (
        <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ type: 'spring', damping: 20 }}
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
            ]}
        >
            <Pressable onPress={onHide} style={styles.content}>
                <View style={styles.iconContainer}>{getIcon()}</View>
                <MotiText style={[styles.message, { color: getTextColor() }]}>
                    {message}
                </MotiText>
            </Pressable>
        </MotiView>
    );
}

// Toast hook for easier usage
export function useToast() {
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const showToast = useCallback(
        (message: string, type: 'success' | 'error' | 'info' = 'success') => {
            setToast({ visible: true, message, type });
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast((prev) => ({ ...prev, visible: false }));
    }, []);

    const ToastComponent = useCallback(
        () => (
            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={hideToast}
                type={toast.type}
            />
        ),
        [toast, hideToast]
    );

    return { showToast, hideToast, ToastComponent };
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: 24,
        right: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
});
