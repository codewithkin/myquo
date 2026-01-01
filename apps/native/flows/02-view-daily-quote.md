# Flow 2: View Daily Quote

**Trigger:** User opens the app (after onboarding) or navigates to Home tab

## Steps

1. **App Launch**
   - Show splash screen briefly
   - Load today's date and device seed

2. **Quote Selection**
   - Calculate context: weekday, month, holiday (if any), locale
   - Query candidate quotes from SQLite based on context
   - Apply weighted deterministic selection algorithm
   - Retrieve selected quote

3. **Display Quote**
   - Home screen shows:
     - Large, readable quote text (centered)
     - Author name (below quote)
     - Small date indicator ("Today, January 1")
     - Action buttons at bottom:
       - Heart icon (Favorite)
       - Share icon (Share)
       - Copy icon (Copy to clipboard)
   - Background: clean, minimal (support light/dark mode)

4. **User Interactions**
   - Tap quote text → Expand to full screen (if truncated)
   - Tap Favorite → Flow 3
   - Tap Share → Flow 4
   - Tap Copy → Copy quote text + author to clipboard, show toast "Copied!"

## Data Flow
- Input: Current date, device seed, user region
- Query: SQLite candidates based on context
- Algorithm: Weighted deterministic selection
- Output: Single quote object { id, text, author }
- Store: Log quote ID + date in history table

## Success Criteria
- Quote loads within 500ms
- Same quote shows all day (deterministic)
- Actions (favorite, share, copy) work correctly
- Quote is logged to history

## Edge Cases
- No candidates found → Fall back to broader query (ignore month/weekday)
- Database error → Show error message with retry
- First quote of the day → Ensure it's different from yesterday (log check)
- Timezone change → Recalculate based on device timezone
