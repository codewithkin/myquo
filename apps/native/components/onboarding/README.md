# Onboarding Components

Beautiful, animated onboarding flow for myquo using Moti animations.

## Components

### `OnboardingSlide`
Reusable slide component with entrance animations for icons, titles, and descriptions.

**Props:**
- `icon`: ReactNode - The icon/illustration for the slide
- `title`: string - Main heading
- `description`: string - Supporting text
- `isActive`: boolean - Whether this slide is currently visible
- `index`: number - Slide index for staggered animations

**Animations:**
- Icon: Scale + rotation with spring animation
- Title: Translate Y with fade
- Description: Translate Y with fade (delayed)

### `PageIndicator`
Animated pagination dots that expand when active.

**Props:**
- `totalPages`: number - Total number of pages
- `currentPage`: number - Current active page (0-indexed)
- `activeColor`: string - Color for active dot (default: #6366F1)
- `inactiveColor`: string - Color for inactive dots

**Animation:**
- Width expands from 8px to 32px when active
- Color transition with spring animation

### `OnboardingButton`
Pressable button with scale and transform animations.

**Props:**
- `title`: string - Button text
- `onPress`: () => void - Press handler
- `variant`: 'primary' | 'secondary' - Visual style
- `icon`: ReactNode - Optional icon (animates on press)

**Animations:**
- Scale down on press
- Icon translates on press
- Shadow and elevation effects

### `RegionPicker`
Scrollable region selector with animated cards.

**Props:**
- `onSelect`: (region) => void - Called when region is selected
- `initialRegion`: string - Default region code (default: 'US')

**Features:**
- 12 pre-configured regions with emoji flags
- Staggered entrance animations
- Selected state with border and checkmark
- Smooth transitions between states

### Slide Icons

Custom SVG icons with Moti animations:

#### `QuoteIcon`
- Quote marks with decorative lines
- Continuous rotation animation (20s loop)
- Indigo color scheme

#### `CalendarIcon`
- Calendar with bouncing rings
- Animated date dots
- Amber color scheme

#### `WidgetIcon`
- Phone mockup with widget
- Pulsing widget card
- Indigo color scheme

## Main Screen

`app/onboarding.tsx` - Complete onboarding flow

**Features:**
- 3 swipeable slides using react-native-reanimated-carousel
- Animated skip button
- Page indicator
- Region picker (shown after last slide)
- Smooth transitions between screens
- Dark mode support

**Flow:**
1. Welcome slide (Quote icon)
2. Features slide (Calendar icon)
3. Widget slide (Widget icon)
4. Region picker
5. Complete and navigate to main app

## Usage

```tsx
import { useRouter } from 'expo-router';

// Navigate to onboarding
router.push('/onboarding');

// Or set as initial route for first-time users
if (!hasCompletedOnboarding) {
  router.replace('/onboarding');
}
```

## Styling

All components support light and dark mode via `useColorScheme()`.

Color scheme:
- Primary: #6366F1 (Indigo)
- Secondary: #8B5CF6 (Purple)
- Success: #10B981 (Emerald)
- Background (dark): #111827
- Background (light): #FFFFFF
- Text (dark): #FFFFFF
- Text (light): #1A1A1A

## Dependencies

- `moti` - Declarative animations for React Native
- `react-native-reanimated-carousel` - Smooth carousel for slides
- `react-native-svg` - SVG icons
- `react-native-reanimated` - Core animation library

## Customization

### Change slide content
Edit the `SLIDES` array in `app/onboarding.tsx`:

```tsx
const SLIDES: OnboardingSlideData[] = [
  {
    id: 'custom',
    icon: <YourIcon />,
    title: 'Your Title',
    description: 'Your description',
  },
];
```

### Add more regions
Edit the `REGIONS` array in `components/onboarding/region-picker.tsx`.

### Modify animations
All animation parameters are in the component files:
- Duration, delay, spring damping can be adjusted
- Transition types: 'spring', 'timing'
- Look for `transition` props in Moti components

## Performance

- Animations use native driver (via Reanimated)
- SVG icons are lightweight
- Carousel is optimized for smooth scrolling
- No heavy computations on main thread
