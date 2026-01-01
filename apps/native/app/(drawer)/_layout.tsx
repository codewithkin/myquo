import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback, useEffect } from "react";
import { Pressable, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeToggle } from "@/components/theme-toggle";
import { WidgetService } from "@/lib/widget-service";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  // Initialize widget scheduling on app start
  useEffect(() => {
    const initializeWidget = async () => {
      if (!WidgetService.isAvailable()) {
        return;
      }

      try {
        // Check if user has customized widget update time
        const savedHour = await AsyncStorage.getItem('widget_update_hour');
        const savedMinute = await AsyncStorage.getItem('widget_update_minute');

        if (savedHour !== null && savedMinute !== null) {
          // Use saved custom time
          const hour = parseInt(savedHour);
          const minute = parseInt(savedMinute);
          await WidgetService.scheduleUpdatesAtTime(hour, minute);
        } else {
          // Use default midnight schedule
          await WidgetService.scheduleUpdates();
        }
      } catch (error) {
        console.error('Error initializing widget:', error);
      }
    };

    initializeWidget();
  }, []);

  return (
    <Drawer
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "Home",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : themeColorForeground }}>Home</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={focused ? color : themeColorForeground}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "Tabs",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? color : themeColorForeground }}>Tabs</Text>
          ),
          drawerIcon: ({ size, color, focused }) => (
            <MaterialIcons
              name="border-bottom"
              size={size}
              color={focused ? color : themeColorForeground}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable className="mr-4">
                <Ionicons name="add-outline" size={24} color={themeColorForeground} />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
