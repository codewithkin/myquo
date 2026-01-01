import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";

export default function TabLayout() {
    const themeColorForeground = useThemeColor("foreground");
    const themeColorBackground = useThemeColor("background");

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: themeColorBackground,
                },
                headerTintColor: themeColorForeground,
                headerTitleStyle: {
                    color: themeColorForeground,
                    fontWeight: "600",
                },
                tabBarStyle: {
                    backgroundColor: themeColorBackground,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: "#6366F1",
                tabBarInactiveTintColor: themeColorForeground,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <Ionicons name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
