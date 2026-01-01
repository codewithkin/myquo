import { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    useColorScheme,
    Dimensions,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { OnboardingSlide } from '../components/onboarding/onboarding-slide';
import { PageIndicator } from '../components/onboarding/page-indicator';
import { OnboardingButton } from '../components/onboarding/onboarding-button';
import { RegionPicker } from '../components/onboarding/region-picker';
import { QuoteIcon, CalendarIcon, WidgetIcon } from '../components/onboarding/slide-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlideData {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const SLIDES: OnboardingSlideData[] = [
    {
        id: 'quote',
        icon: <QuoteIcon />,
        title: 'A new quote every day',
        description: 'Get a fresh motivational quote every 24 hours, personalized just for you',
    },
    {
        id: 'calendar',
        icon: <CalendarIcon />,
        title: 'Smart & contextual',
        description: 'Quotes adapt to weekdays, holidays, and special occasions in your region',
    },
    {
        id: 'widget',
        icon: <WidgetIcon />,
        title: 'Add to your home screen',
        description: 'Access your daily quote right from your home screen widget',
    },
];

export default function OnboardingScreen() {
    const [currentPage, setCurrentPage] = useState(0);
    const [showRegionPicker, setShowRegionPicker] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const carouselRef = useRef<ICarouselInstance>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    const isLastSlide = currentPage === SLIDES.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            setShowRegionPicker(true);
        } else {
            carouselRef.current?.next();
        }
    };

    const handleSkip = () => {
        // Save that user skipped onboarding
        router.replace('/(drawer)/(tabs)');
    };

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
    };

    const handleComplete = async () => {
        // Save selected region and complete onboarding
        // TODO: Save to storage
        console.log('Onboarding complete with region:', selectedRegion);
        router.replace('/(drawer)/(tabs)');
    };

    if (showRegionPicker) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
                ]}
            >
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={isDark ? '#111827' : '#FFFFFF'}
                />
                <RegionPicker
                    onSelect={handleRegionSelect}
                    initialRegion="US"
                />
                <MotiView
                    from={{ translateY: 100, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'spring', delay: 600 }}
                    style={styles.buttonContainer}
                >
                    <OnboardingButton
                        title="Get Started"
                        onPress={handleComplete}
                        variant="primary"
                    />
                    <View style={{ height: 12 }} />
                    <OnboardingButton
                        title="Skip for now"
                        onPress={handleComplete}
                        variant="secondary"
                    />
                </MotiView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
            ]}
        >
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#111827' : '#FFFFFF'}
            />

            {/* Skip Button */}
            <MotiView
                from={{ translateY: -50, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: 300 }}
                style={styles.skipContainer}
            >
                <OnboardingButton
                    title="Skip"
                    onPress={handleSkip}
                    variant="secondary"
                />
            </MotiView>

            {/* Carousel */}
            <View style={styles.carouselContainer}>
                <Carousel
                    ref={carouselRef}
                    width={SCREEN_WIDTH}
                    height={SCREEN_HEIGHT * 0.6}
                    data={SLIDES}
                    onProgressChange={(_, absoluteProgress) => {
                        const page = Math.round(absoluteProgress);
                        setCurrentPage(page);
                    }}
                    renderItem={({ item, index }) => (
                        <OnboardingSlide
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            isActive={currentPage === index}
                            index={index}
                        />
                    )}
                />
            </View>

            {/* Page Indicator */}
            <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 500 }}
                style={styles.indicatorContainer}
            >
                <PageIndicator
                    totalPages={SLIDES.length}
                    currentPage={currentPage}
                    activeColor="#6366F1"
                    inactiveColor={isDark ? '#374151' : '#D1D5DB'}
                />
            </MotiView>

            {/* Next Button */}
            <MotiView
                from={{ translateY: 100, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: 600 }}
                style={styles.buttonContainer}
            >
                <OnboardingButton
                    title={isLastSlide ? 'Continue' : 'Next'}
                    onPress={handleNext}
                    variant="primary"
                    icon={
                        isLastSlide ? undefined : (
                            <View style={styles.arrow}>
                                <MotiView
                                    animate={{
                                        translateX: [0, 4, 0],
                                    }}
                                    transition={{
                                        type: 'timing',
                                        duration: 1000,
                                        loop: true,
                                    }}
                                >
                                    {/* Arrow SVG would go here, using text for simplicity */}
                                    <View style={{ width: 20, height: 20 }} />
                                </MotiView>
                            </View>
                        )
                    }
                />
            </MotiView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipContainer: {
        position: 'absolute',
        top: 20,
        right: 24,
        zIndex: 10,
        width: 100,
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    indicatorContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    arrow: {
        width: 20,
        height: 20,
    },
});
