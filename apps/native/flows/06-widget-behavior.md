# Widget Behavior & Update Cycle

**Note:** This isn't a user-initiated flow, but the automated widget behavior that runs in the background.

## Daily Update Cycle

### 1. Scheduled Update Trigger
- **When:** Daily at configured time (default: 12:00 AM local time)
- **How:** WorkManager periodic work request
- **Frequency:** Once per 24 hours

### 2. Update Workflow

```
[Midnight / Update Time]
         ↓
[WorkManager triggers update]
         ↓
[Widget reads current date + device seed]
         ↓
[Query SQLite for candidate quotes]
         ↓
[Apply selection algorithm]
         ↓
[Get today's quote]
         ↓
[Update widget RemoteViews/Glance]
         ↓
[Widget displays new quote]
```

### 3. Widget Components Displayed

**Minimum Layout (2x2):**
- Quote text (auto-sized, max 3-4 lines)
- Author name (smaller text)
- Small myquo branding (bottom corner)
- Optional: Refresh icon (future)

**Styling:**
- Light/dark theme support (follows system)
- Clean typography
- Minimal padding
- No ads

### 4. Widget Interactions

**Tap Widget → Open App**
- Action: Launch app to Home screen
- Deep link: myquo://quote/today
- Behavior: App shows today's quote with full actions

**No other interactions in MVP** (future: refresh button, favorite button)

## Update Scenarios

### Normal Day
- Widget updates at midnight
- New quote selected based on date
- User sees new quote next time they view widget

### Missed Update
- Device was off at midnight
- WorkManager runs update when device turns on
- Widget shows quote for current date (not yesterday's)

### Manual App Open
- Widget is NOT updated when app opens
- Widget only updates on schedule
- App and widget always show same quote (same date + seed)

### Timezone Change
- Widget updates use device local time
- If user travels, quote changes based on local date
- Maintains deterministic selection per date in new timezone

### First Install
- Widget shows placeholder: "Open app to get started"
- After first app launch → Widget initializes and shows quote
- Widget reschedules updates

## Technical Implementation

### Android AppWidgetProvider
```kotlin
class QuoteWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context, appWidgetManager, appWidgetIds) {
    // Read date + device seed
    // Query quote from SQLite
    // Build RemoteViews with quote
    // Set tap PendingIntent to open app
    // Update widget
  }
  
  override fun onEnabled(context) {
    // First widget added → schedule WorkManager
  }
  
  override fun onDisabled(context) {
    // Last widget removed → cancel WorkManager
  }
}
```

### WorkManager Scheduling
```kotlin
fun scheduleQuoteUpdate(context) {
  val constraints = Constraints.Builder()
    .setRequiresBatteryNotLow(false) // Should work even on low battery
    .build()
    
  val updateRequest = PeriodicWorkRequestBuilder<QuoteUpdateWorker>(
    repeatInterval = 24, 
    repeatIntervalTimeUnit = TimeUnit.HOURS
  )
    .setConstraints(constraints)
    .setInitialDelay(calculateDelayUntilMidnight(), TimeUnit.MILLISECONDS)
    .build()
    
  WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "quote_widget_update",
    ExistingPeriodicWorkPolicy.KEEP,
    updateRequest
  )
}
```

## Performance Requirements
- Update execution time: < 1 second
- Memory usage: < 50MB during update
- No network calls (fully offline)
- Battery impact: Negligible (once per day)

## Testing Scenarios
- [ ] Widget updates at exactly midnight
- [ ] Widget survives device restart
- [ ] Widget shows correct quote after timezone change
- [ ] Multiple widgets on home screen all show same quote
- [ ] Widget works in Doze/App Standby modes
- [ ] Widget updates correctly on date rollover
- [ ] Widget handles database errors gracefully
- [ ] Tapping widget opens app correctly
- [ ] Widget layout looks good in light/dark modes
- [ ] Widget fits well in 2x2 grid

## Monitoring & Debugging
- Log update times and quote IDs
- Track update success/failure rates
- Monitor battery usage via Android Vitals
- Provide "Last updated" timestamp in widget (debug mode)

## Future Enhancements
- Pull-to-refresh in widget (future Android versions)
- Multiple widget sizes and layouts
- Widget configuration activity (choose theme, size)
- Widget shows next quote preview (future)
- Animation on quote change (subtle fade)
