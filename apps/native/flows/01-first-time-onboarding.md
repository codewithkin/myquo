# Flow 1: First-Time Onboarding

**Trigger:** User opens the app for the first time (no device seed exists)

## Steps

1. **Welcome Screen**
   - App logo and name "myquo"
   - Tagline: "Daily motivation, just for you"
   - "Get Started" button

2. **What is myquo? (Intro Slide 1)**
   - Visual: Widget preview mockup
   - Title: "A new quote every day"
   - Description: "Get a fresh motivational quote every 24 hours, personalized to your day"
   - Progress indicator (1/3)
   - "Next" button

3. **How it works (Intro Slide 2)**
   - Visual: Calendar/date icon with quote bubble
   - Title: "Smart & contextual"
   - Description: "Quotes adapt to weekdays, holidays, and your locale"
   - Progress indicator (2/3)
   - "Next" button

4. **Widget Setup (Intro Slide 3)**
   - Visual: Phone home screen with widget
   - Title: "Add to your home screen"
   - Description: "Access your daily quote right from your home screen widget"
   - Progress indicator (3/3)
   - "Got it" or "Add Widget Later" button

5. **Holiday Region Selection**
   - Title: "Choose your region"
   - Description: "Get quotes that match your local holidays"
   - Dropdown/picker: Country/region selection (default: device locale)
   - "Continue" button

6. **Initial Setup Complete**
   - Generate and store device seed (UUID)
   - Initialize SQLite DB (copy from assets if needed)
   - Navigate to Home screen showing today's quote

## Success Criteria
- Device seed generated and stored
- User preferences saved (region)
- Database initialized
- User lands on Home screen with today's quote displayed

## Edge Cases
- User presses back during onboarding → Show "Skip onboarding?" dialog
- Database initialization fails → Show error and retry option
- No region selected → Default to device locale or "Global"
