# Flow 4: Share Quote

**Trigger:** User taps the share icon on a quote (Home, History, or Favorites screen)

## Steps

1. **Tap Share Icon**
   - User taps share icon on current quote

2. **Prepare Share Content**
   - Format share text:
     ```
     "{quote text}"
     — {author}
     
     Shared from myquo
     ```
   - Example:
     ```
     "Your limitation—it's only your imagination."
     — Unknown
     
     Shared from myquo
     ```

3. **Open Native Share Sheet**
   - Trigger Android share intent/sheet
   - Pass formatted text as share content
   - Include app name in metadata (optional)

4. **User Selects Share Target**
   - User chooses app/contact to share with (WhatsApp, Messages, Email, etc.)
   - Android handles the actual share
   - App returns to foreground after share completes or cancels

5. **Track Share (Optional)**
   - Log share event for analytics (if implemented)
   - No UI change needed

## Technical Details
- Use React Native Share API or Expo Sharing module
- Share type: Text only (for MVP)
- No image generation in MVP (nice-to-have for future)

## Success Criteria
- Share sheet opens within 200ms
- Formatted text is clean and readable
- Share completes successfully to chosen target
- User returns to app after sharing

## Edge Cases
- Share cancelled → No action needed, user returns to app
- No share targets available → Rare on Android, show toast "No apps available to share"
- Very long quote → Text truncates in some apps (acceptable for MVP)
- Special characters → Ensure proper encoding (quotes, em-dashes, emoji)

## Future Enhancements
- Share as image (quote card with background)
- Customize share message prefix/suffix
- Share directly to specific apps (shortcuts)
