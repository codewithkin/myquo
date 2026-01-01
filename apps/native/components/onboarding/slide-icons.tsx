import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Animated Quote Icon
export function QuoteIcon() {
    return (
        <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
                type: 'timing',
                duration: 20000,
                loop: true,
            }}
            style={styles.iconWrapper}
        >
            <Svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                {/* Background Circle */}
                <Circle cx="80" cy="80" r="70" fill="#EEF2FF" />

                {/* Quote Marks */}
                <Path
                    d="M50 55C50 45 42 37 32 37V50C37 50 40 53 40 58V65C40 70 36 75 30 75C24 75 20 70 20 65V50C20 36 32 25 45 25C48 25 50 27 50 30V55Z"
                    fill="#6366F1"
                />
                <Path
                    d="M90 55C90 45 82 37 72 37V50C77 50 80 53 80 58V65C80 70 76 75 70 75C64 75 60 70 60 65V50C60 36 72 25 85 25C88 25 90 27 90 30V55Z"
                    fill="#8B5CF6"
                />

                {/* Decorative Lines */}
                <Path
                    d="M30 95H130"
                    stroke="#C7D2FE"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
                <Path
                    d="M45 110H115"
                    stroke="#DDD6FE"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </Svg>
        </MotiView>
    );
}

// Animated Calendar Icon
export function CalendarIcon() {
    return (
        <View style={styles.iconWrapper}>
            <Svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                {/* Background Circle */}
                <Circle cx="80" cy="80" r="70" fill="#FEF3C7" />

                {/* Calendar Body */}
                <Rect x="40" y="50" width="80" height="70" rx="8" fill="#FFFFFF" />
                <Rect x="40" y="50" width="80" height="20" rx="8" fill="#F59E0B" />

                {/* Calendar Rings */}
                <MotiView
                    from={{ translateY: 0 }}
                    animate={{ translateY: -3 }}
                    transition={{
                        type: 'timing',
                        duration: 1000,
                        loop: true,
                        repeatReverse: true,
                    }}
                >
                    <Svg width="160" height="160" viewBox="0 0 160 160">
                        <Rect x="55" y="45" width="6" height="12" rx="3" fill="#D97706" />
                        <Rect x="99" y="45" width="6" height="12" rx="3" fill="#D97706" />
                    </Svg>
                </MotiView>

                {/* Calendar Dots */}
                <Circle cx="58" cy="85" r="4" fill="#FCD34D" />
                <Circle cx="75" cy="85" r="4" fill="#FCD34D" />
                <Circle cx="92" cy="85" r="4" fill="#FCD34D" />
                <Circle cx="58" cy="100" r="4" fill="#FCD34D" />
                <Circle cx="75" cy="100" r="4" fill="#F59E0B" />
                <Circle cx="92" cy="100" r="4" fill="#FCD34D" />
            </Svg>
        </View>
    );
}

// Animated Widget Icon
export function WidgetIcon() {
    return (
        <View style={styles.iconWrapper}>
            <Svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                {/* Phone Background */}
                <Rect x="35" y="25" width="90" height="110" rx="12" fill="#1F2937" />

                {/* Phone Screen */}
                <Rect x="40" y="35" width="80" height="90" rx="6" fill="#F3F4F6" />

                {/* Widget */}
                <MotiView
                    from={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'timing',
                        duration: 1500,
                        loop: true,
                        repeatReverse: true,
                    }}
                >
                    <Svg width="160" height="160" viewBox="0 0 160 160">
                        <Rect x="48" y="45" width="64" height="55" rx="8" fill="#6366F1" />

                        {/* Quote Lines */}
                        <Rect x="55" y="55" width="35" height="3" rx="1.5" fill="#FFFFFF" opacity="0.9" />
                        <Rect x="55" y="62" width="50" height="3" rx="1.5" fill="#FFFFFF" opacity="0.9" />
                        <Rect x="55" y="69" width="45" height="3" rx="1.5" fill="#FFFFFF" opacity="0.9" />

                        {/* Author */}
                        <Rect x="55" y="82" width="25" height="2" rx="1" fill="#FFFFFF" opacity="0.6" />
                    </Svg>
                </MotiView>

                {/* Home Button */}
                <Circle cx="80" cy="115" r="3" fill="#9CA3AF" />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
