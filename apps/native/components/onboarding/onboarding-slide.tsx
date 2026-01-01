import { View, StyleSheet, useColorScheme } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { ReactNode } from 'react';

interface OnboardingSlideProps {
    icon: ReactNode;
    title: string;
    description: string;
    isActive: boolean;
    index: number;
}

export function OnboardingSlide({
    icon,
    title,
    description,
    isActive,
    index,
}: OnboardingSlideProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            {/* Icon Container */}
            <MotiView
                from={{ scale: 0, opacity: 0, rotate: '-180deg' }}
                animate={{
                    scale: isActive ? 1 : 0.8,
                    opacity: isActive ? 1 : 0.3,
                    rotate: isActive ? '0deg' : '-180deg',
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 90,
                    delay: isActive ? 200 : 0,
                }}
                style={styles.iconContainer}
            >
                {icon}
            </MotiView>

            {/* Title */}
            <MotiView
                from={{ translateY: 50, opacity: 0 }}
                animate={{
                    translateY: isActive ? 0 : 50,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 600,
                    delay: isActive ? 400 : 0,
                }}
            >
                <MotiText
                    style={[
                        styles.title,
                        { color: isDark ? '#FFFFFF' : '#1A1A1A' },
                    ]}
                >
                    {title}
                </MotiText>
            </MotiView>

            {/* Description */}
            <MotiView
                from={{ translateY: 50, opacity: 0 }}
                animate={{
                    translateY: isActive ? 0 : 50,
                    opacity: isActive ? 1 : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 600,
                    delay: isActive ? 500 : 0,
                }}
            >
                <MotiText
                    style={[
                        styles.description,
                        { color: isDark ? '#A0A0A0' : '#666666' },
                    ]}
                >
                    {description}
                </MotiText>
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        marginBottom: 48,
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
});
