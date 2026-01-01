import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function PageIndicator({
  totalPages,
  currentPage,
  activeColor = '#6366F1',
  inactiveColor = '#D1D5DB',
}: PageIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentPage;
        
        return (
          <MotiView
            key={index}
            from={{
              width: 8,
              backgroundColor: inactiveColor,
            }}
            animate={{
              width: isActive ? 32 : 8,
              backgroundColor: isActive ? activeColor : inactiveColor,
            }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
            }}
            style={styles.dot}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
