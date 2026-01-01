import { View, StyleSheet, useColorScheme } from "react-native";
import { QuoteOfTheDay } from "@/components/quote-of-the-day";

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#F9FAFB" },
      ]}
    >
      <QuoteOfTheDay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
