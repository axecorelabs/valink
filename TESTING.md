## 🧪 Testing Guide

### Before You Start
1. Ensure `.env.local` is configured
2. MongoDB is running/connected
3. Dev server is running: `npm run dev`

### Test 1: Landing Page
1. Go to `http://localhost:3000`
2. Verify:
   - Headline displays correctly
   - 3 feature cards visible
   - CTA button works
   - Pricing info shows

### Test 2: Create Flow
1. Click "Create My Valentine Page"
2. Fill form:
   - Your name: "Daniel"
   - Valentine's name: "Sarah"
   - Select any template
   - Add optional message
3. Verify:
   - Character counters work
   - Template selection highlights
   - Validation shows errors
   - Preview button enabled

### Test 3: Preview Page
1. Click "Preview My Page"
2. Verify:
   - Correct template loads
   - Names display properly
   - Message shows (if added)
   - Preview banner visible
   - Payment button works

### Test 4: Payment (Test Mode)
1. Click "Continue to Payment"
2. Use Paystack test card:
   ```
   Card: 4084 0840 8408 4081
   Expiry: 12/25
   CVV: 408
   ```
3. Complete payment flow
4. Verify redirect to success

### Test 5: Success Page
1. Verify success message
2. Check shareable link format
3. Test copy button
4. Test share button (mobile)
5. Test "Open Page" link

### Test 6: Valentine Viewer
1. Open Valentine page link
2. Verify correct template loads
3. Test template interactions:
   - **Playful**: Move mouse over NO button
   - **Playful**: Click YES, see confetti
   - **Romantic**: Test both buttons
   - **Minimal**: Check text display

### Test 7: Error Handling
1. Try accessing `/v/invalid-id` → 404
2. Create page, don't pay → Payment pending error
3. Check expired page (after Feb 15)

### Test 8: Mobile Responsive
1. Open on mobile/resize browser
2. Verify:
   - Forms are usable
   - Templates display correctly
   - Share button appears
   - Touch interactions work

### Test 9: Database
Check MongoDB to verify:
- Page created with correct data
- Payment status updates to 'paid'
- All fields saved correctly
- Expiry date set

### Test 10: Full End-to-End
1. Create page as User A
2. Complete payment
3. Copy link
4. Open in incognito/different browser
5. Interact with Valentine page
6. Verify "Create your own" link works

## 🔍 What to Check

### Data Validation
- [ ] Names limited to 30 chars
- [ ] Message limited to 120 chars
- [ ] Template ID is 1, 2, or 3
- [ ] Required fields enforced

### Payment Flow
- [ ] Page created before payment
- [ ] Payment status = 'pending' initially
- [ ] Status updates to 'paid' after payment
- [ ] Can't access page without payment

### Template Behavior
- [ ] Playful: NO button escapes cursor
- [ ] Playful: Confetti on YES
- [ ] Romantic: Hearts float
- [ ] Minimal: Clean text display

### Edge Cases
- [ ] Empty message handled
- [ ] Very long names truncated
- [ ] Duplicate page creation works
- [ ] Payment cancellation handled
- [ ] Network errors caught

## 🚨 Red Flags to Watch

- Payment completes but page not accessible
- Template doesn't match selection
- Data not persisting to database
- Links not shareable
- Mobile layout broken
- Animations not working

## ✅ Success Criteria

All tests pass when:
- User can create page in < 60 seconds
- Payment completes smoothly
- Page is immediately shareable
- Templates work on mobile
- No console errors
- Database updates correctly

---

Run these tests before deploying to production!
