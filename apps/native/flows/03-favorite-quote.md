# Flow 3: Favorite a Quote

**Trigger:** User taps the heart/favorite icon on a quote (Home or History screen)

## Steps

1. **Tap Favorite Icon**
   - User taps heart icon on current quote

2. **Toggle Favorite State**
   - Check if quote is already favorited (query favorites table)
   - If not favorited:
     - Add quote ID to favorites table with timestamp
     - Animate heart icon (fill with color, slight bounce)
     - Show subtle toast: "Added to favorites"
   - If already favorited:
     - Remove quote ID from favorites table
     - Animate heart icon (unfill, slight shrink)
     - Show subtle toast: "Removed from favorites"

3. **Update UI**
   - Heart icon state persists (filled = favorited, outline = not favorited)
   - Favorites count updates in Favorites tab (if visible)

## Data Flow
- Input: Quote ID, user action (toggle)
- Query: Check favorites table for existing entry
- Action: INSERT or DELETE in favorites table
- Output: Updated favorite state, UI feedback

## Success Criteria
- Toggle is instant (<100ms)
- State persists across app restarts
- User can access favorited quotes in Favorites tab
- Visual feedback is clear and satisfying

## Edge Cases
- Database write fails → Show error toast, revert icon state
- User favorites while offline → Works (local DB)
- Maximum favorites limit → None for MVP (unlimited)
- Duplicate quote IDs → Prevent with unique constraint on favorites table
