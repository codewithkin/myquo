import { View, StyleSheet, useColorScheme, ScrollView, Switch, Pressable } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    isDark: boolean;
    index: number;
}

function SettingItem({
    icon,
    title,
    description,
    onPress,
    rightElement,
    isDark,
    index,
}: SettingItemProps) {
    return (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 50 }}
        >
            <Pressable
                onPress={onPress}
                style={[
                    styles.settingItem,
                    { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
                ]}
            >
                <View style={styles.settingLeft}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: isDark ? '#374151' : '#F3F4F6' },
                        ]}
                    >
                        {icon}
                    </View>
                    <View style={styles.settingContent}>
                        <MotiText
                            style={[
                                styles.settingTitle,
                                { color: isDark ? '#FFFFFF' : '#111827' },
                            ]}
                        >
                            {title}
                        </MotiText>
                        {description && (
                            <MotiText
                                style={[
                                    styles.settingDescription,
                                    { color: isDark ? '#9CA3AF' : '#6B7280' },
                                ]}
                            >
                                {description}
                            </MotiText>
                        )}
                    </View>
                </View>
                {rightElement}
            </Pressable>
        </MotiView>
    );
}

function SectionHeader({ title, isDark }: { title: string; isDark: boolean }) {
    return (
        <MotiText
            style={[
                styles.sectionHeader,
                { color: isDark ? '#9CA3AF' : '#6B7280' },
            ]}
        >
            {title}
        </MotiText>
    );
}

export default function Settings() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [holidayAware, setHolidayAware] = useState(true);
    const [notifications, setNotifications] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('United States');

    const iconColor = isDark ? '#9CA3AF' : '#6B7280';

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
                    Settings
                </MotiText>
            </MotiView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Preferences Section */}
                <SectionHeader title="PREFERENCES" isDark={isDark} />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" />
                            <Path
                                d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                stroke={iconColor}
                                strokeWidth="2"
                            />
                        </Svg>
                    }
                    title="Holiday Region"
                    description={selectedRegion}
                    onPress={() => {/* Open region picker */ }}
                    rightElement={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M9 18l6-6-6-6"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    isDark={isDark}
                    index={0}
                />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Holiday-Aware Quotes"
                    description="Show special quotes on holidays"
                    rightElement={
                        <Switch
                            value={holidayAware}
                            onValueChange={setHolidayAware}
                            trackColor={{ false: '#374151', true: '#6366F1' }}
                            thumbColor="#FFFFFF"
                        />
                    }
                    isDark={isDark}
                    index={1}
                />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Daily Reminder"
                    description="Get notified when a new quote is ready"
                    rightElement={
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#374151', true: '#6366F1' }}
                            thumbColor="#FFFFFF"
                        />
                    }
                    isDark={isDark}
                    index={2}
                />

                {/* Widget Section */}
                <SectionHeader title="WIDGET" isDark={isDark} />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Update Time"
                    description="Midnight (12:00 AM)"
                    onPress={() => {/* Open time picker */ }}
                    rightElement={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M9 18l6-6-6-6"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    isDark={isDark}
                    index={3}
                />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="How to Add Widget"
                    description="Learn to add myquo to your home screen"
                    onPress={() => {/* Show widget tutorial */ }}
                    rightElement={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M9 18l6-6-6-6"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    isDark={isDark}
                    index={4}
                />

                {/* About Section */}
                <SectionHeader title="ABOUT" isDark={isDark} />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" />
                            <Path
                                d="M12 16v-4M12 8h.01"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Version"
                    description="1.0.0"
                    isDark={isDark}
                    index={5}
                />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Privacy Policy"
                    onPress={() => {/* Open privacy policy */ }}
                    rightElement={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    isDark={isDark}
                    index={6}
                />

                <SettingItem
                    icon={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <Path
                                d="M22 6l-10 7L2 6"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    title="Send Feedback"
                    onPress={() => {/* Open feedback */ }}
                    rightElement={
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                                stroke={iconColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </Svg>
                    }
                    isDark={isDark}
                    index={7}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginTop: 24,
        marginBottom: 12,
        paddingLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 14,
        marginTop: 2,
    },
});
