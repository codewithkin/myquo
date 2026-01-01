import { View, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useState } from 'react';
import { OnboardingButton } from './onboarding-button';

interface Region {
  code: string;
  name: string;
  emoji: string;
}

const REGIONS: Region[] = [
  { code: 'US', name: 'United States', emoji: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧' },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦' },
  { code: 'AU', name: 'Australia', emoji: '🇦🇺' },
  { code: 'DE', name: 'Germany', emoji: '🇩🇪' },
  { code: 'FR', name: 'France', emoji: '🇫🇷' },
  { code: 'ES', name: 'Spain', emoji: '🇪🇸' },
  { code: 'IT', name: 'Italy', emoji: '🇮🇹' },
  { code: 'JP', name: 'Japan', emoji: '🇯🇵' },
  { code: 'BR', name: 'Brazil', emoji: '🇧🇷' },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽' },
  { code: 'IN', name: 'India', emoji: '🇮🇳' },
];

interface RegionPickerProps {
  onSelect: (region: Region) => void;
  initialRegion?: string;
}

export function RegionPicker({ onSelect, initialRegion = 'US' }: RegionPickerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSelect = (region: Region) => {
    setSelectedRegion(region.code);
    onSelect(region);
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ translateY: -50, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 600 }}
        style={styles.header}
      >
        <MotiText
          style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
        >
          Choose your region
        </MotiText>
        <MotiText
          style={[styles.subtitle, { color: isDark ? '#A0A0A0' : '#666666' }]}
        >
          Get quotes that match your local holidays
        </MotiText>
      </MotiView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {REGIONS.map((region, index) => {
          const isSelected = selectedRegion === region.code;
          
          return (
            <MotiView
              key={region.code}
              from={{ translateX: -50, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{
                type: 'timing',
                duration: 400,
                delay: index * 50,
              }}
            >
              <MotiView
                animate={{
                  backgroundColor: isSelected
                    ? isDark
                      ? '#4F46E5'
                      : '#6366F1'
                    : isDark
                    ? '#2A2A2A'
                    : '#F3F4F6',
                  scale: isSelected ? 1.02 : 1,
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: isSelected ? '#8B5CF6' : 'transparent',
                }}
                transition={{
                  type: 'spring',
                  damping: 20,
                }}
                style={styles.regionCard}
                onTouchEnd={() => handleSelect(region)}
              >
                <View style={styles.regionContent}>
                  <MotiText style={styles.emoji}>{region.emoji}</MotiText>
                  <MotiText
                    style={[
                      styles.regionName,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : isDark
                          ? '#FFFFFF'
                          : '#1F2937',
                      },
                    ]}
                  >
                    {region.name}
                  </MotiText>
                </View>
                {isSelected && (
                  <MotiView
                    from={{ scale: 0, rotate: '-90deg' }}
                    animate={{ scale: 1, rotate: '0deg' }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <MotiText style={styles.checkmark}>✓</MotiText>
                  </MotiView>
                )}
              </MotiView>
            </MotiView>
          );
        })}
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  regionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
