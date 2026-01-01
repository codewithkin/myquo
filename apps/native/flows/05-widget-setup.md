# Flow 5: Widget Setup

**Trigger:** User wants to add the myquo widget to their home screen

## Steps

1. **Navigate to Widget Setup**
   - From app: Tap "Add Widget" in Settings or from Home screen prompt
   - From Android: Long-press home screen → Widgets → Find "myquo"

2. **Android Widget Picker**
   - User sees myquo widget in system widget picker
   - Widget preview shows sample quote
   - Widget name: "myquo - Daily Quote"
   - Widget size options (start with 2x2 for MVP)

3. **Add Widget to Home Screen**
   - User drags widget to desired position
   - Widget placement confirmed
   - Android triggers widget creation

4. **Widget Initialization**
   - Widget reads device seed from shared preferences
   - Widget loads today's quote from SQLite
   - Widget renders quote text + author
   - Widget registers tap action (opens app)

5. **First Widget Update**
   - WorkManager schedules daily update (default: midnight)
   - Widget shows current quote immediately

6. **Widget Added Confirmation (in-app)**
   - If user added from app prompt → Show success message
   - If added from home screen → No in-app confirmation needed

## Technical Details
- Widget type: AppWidgetProvider (native Android) or Jetpack Glance
- Size: 2x2 grid cells (resizable in future)
- Update frequency: Daily at user-configured time (default midnight)
- Data source: Shared SQLite database in app storage
- Tap action: Deep link to app home screen

## Widget Permissions
- No special permissions required
- Widget runs in app context (same storage access)

## Success Criteria
- Widget appears on home screen with today's quote
- Widget updates daily at configured time
- Tapping widget opens app to today's quote
- Widget survives device restart
- Widget is lightweight (<100KB RAM)

## Edge Cases
- App not installed → Widget unavailable (system prevents)
- Database not initialized → Widget shows "Open app to initialize"
- Widget added before app first run → Initialize DB on widget creation
- Multiple widgets added → All show same quote (same device seed + date)
- User changes update time in settings → Reschedule WorkManager
- Device in Doze mode → WorkManager handles wake-up appropriately
- Storage permission issues → Fallback to default quote or error message

## Widget Configuration (Future)
- Widget size options (1x1, 2x2, 4x2)
- Widget theme (light/dark/auto)
- Widget refresh on tap option
