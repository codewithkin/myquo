import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';

interface OnboardingButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
}

export function OnboardingButton({
    title,
    onPress,
    variant = 'primary',
    icon,
}: OnboardingButtonProps) {
    const [isPressed, setIsPressed] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const isPrimary = variant === 'primary';

    const backgroundColor = isPrimary
        ? '#6366F1'
        : isDark
            ? '#2A2A2A'
            : '#F3F4F6';

    const textColor = isPrimary
        ? '#FFFFFF'
        : isDark
            ? '#FFFFFF'
            : '#1F2937';

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={styles.pressable}
        >
            <MotiView
                animate={{
                    scale: isPressed ? 0.95 : 1,
                    backgroundColor,
                }}
                transition={{
                    type: 'timing',
                    duration: 150,
                }}
                style={[
                    styles.button,
                    !isPrimary && styles.secondaryButton,
                ]}
            >
                <MotiView
                    animate={{
                        translateX: isPressed ? (icon ? -4 : 0) : 0,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 20,
                    }}
                    style={styles.content}
                >
                    <MotiText
                        style={[styles.text, { color: textColor }]}
                        animate={{
                            scale: isPressed ? 0.98 : 1,
                        }}
                    >
                        {title}
                    </MotiText>
                    {icon && (
                        <MotiView
                            animate={{
                                translateX: isPressed ? 4 : 0,
                            }}
                            transition={{
                                type: 'spring',
                                damping: 20,
                            }}
                            style={styles.icon}
                        >
                            {icon}
                        </MotiView>
                    )}
                </MotiView>
            </MotiView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondaryButton: {
        shadowOpacity: 0.1,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.3,
    },
    icon: {
        width: 20,
        height: 20,
    },
});
