# Task 4: Manual QA Testing Report — AMM Shop the Look Feature

## Overview
This document guides the manual QA testing of the Shop the Look feature across all 5 layouts.

**Implementation Status:** Complete (Tasks 1-3 finished)
- Section template: `/sections/amm-shop-the-look.liquid`
- CSS: `/assets/amm-shop-the-look.css`
- JavaScript: `/assets/amm-shop-the-look.js`

**Theme Check Status:** PASSING (no errors related to amm-shop-the-look)

---

## Test Setup

### 1. Prerequisites
- Shopify CLI installed and authenticated: `shopify auth login`
- Access to AMM-v2 development/preview store
- Browser with DevTools for debugging (Chrome/Firefox recommended)

### 2. Start Dev Server
```bash
cd /Users/shafi/Documents/"Whitaker Grp"/AMM-v2
shopify theme dev --store=<store-handle>
```
This will provide a preview URL: `https://[store].myshopify.com/?preview_theme_id=[id]`

### 3. Create Test Page
1. Go to Shopify Admin > Online Store > Pages
2. Create new page: "Shop the Look Test"
3. In theme editor, add "AMM Shop the Look" section
4. Add 3-4 test products as blocks

---

## Layout 1: Editorial Split

### Setup
- Add 3-4 products
- Set layout to "Editorial Split"
- No hotspot settings needed

### Desktop Tests (1000px+)
- [ ] Product cards display in 2-column layout (image + details)
- [ ] Hover product card image → plus button appears (opacity 0 → 1)
- [ ] Plus button is white with black border
- [ ] Click plus button → drawer slides up smoothly
- [ ] Drawer scaleY animation visible (0 → 1)
- [ ] Drawer shows product title in header
- [ ] Size options display all available variants
- [ ] First size option auto-selected (has black background + white text)
- [ ] Click different size → selection changes (black highlight moves)
- [ ] Quantity field starts at 1
- [ ] Click qty + button → increases (1 → 2 → 3...)
- [ ] Click qty - button → decreases
- [ ] Qty - button stops at 1 (doesn't go negative)
- [ ] Click "ADD TO CART" → button shows "ADDING..."
- [ ] Cart count in header increments
- [ ] Drawer closes after success
- [ ] Quantity resets to 1
- [ ] Click X close button → drawer closes
- [ ] Click plus again → drawer reopens with fresh state

### Mobile Tests (375px)
- [ ] Plus button always visible (not just on hover)
- [ ] Drawer opens full width
- [ ] Drawer doesn't exceed viewport height
- [ ] Size buttons wrap if needed
- [ ] All controls accessible and clickable
- [ ] Close and reopen drawer multiple times works

---

## Layout 2: Hotspot Interactive

### Setup
- Add 3-4 products
- Enable "Show as hotspot" for some products
- Set layout to "Hotspot Interactive"
- Configure hotspot positions (left %, top %)

### Desktop Tests
- [ ] Hotspot dots appear on image at specified coordinates
- [ ] Dots are white circles with pulsing ring animation
- [ ] Click hotspot dot → floating card appears below
- [ ] Card shows product image, title, price
- [ ] Plus button visible on floating card
- [ ] Click plus on floating card → product drawer opens
- [ ] Drawer size/qty/add-to-cart work identically to Editorial Split
- [ ] Multiple floating cards can be open independently
- [ ] Click another hotspot → toggles that card (closes others)
- [ ] Hotspot dot color changes on hover/active (black bg, white text)
- [ ] Floating card positioned correctly relative to hotspot location

### Mobile Tests (375px)
- [ ] Hotspot dots visible and responsive
- [ ] Card positioning adapts to viewport
- [ ] Drawer works same as desktop

---

## Layout 3: Cinematic Drawer

### Setup
- Add 3-4 products
- Set layout to "Cinematic Drawer"
- Background image shows full viewport

### Desktop Tests
- [ ] Full-screen cinematic layout with image background
- [ ] Dark overlay gradient at bottom
- [ ] Section title/subheading centered on image
- [ ] Bottom trigger bar shows "Shop this look" + item count
- [ ] Trigger bar styled with dark semi-transparent background
- [ ] Click trigger bar → main drawer slides up from bottom
- [ ] Arrow icon in trigger rotates 180° when drawer open
- [ ] Drawer shows product list (products scroll horizontally)
- [ ] Each product in drawer has plus button
- [ ] Click plus on any product → individual drawer opens
- [ ] Individual drawers independent (closing one doesn't affect others)
- [ ] Size/qty/add-to-cart work for each drawer
- [ ] Close button (X) on drawer closes it
- [ ] Click outside drawer (backdrop) closes it
- [ ] Backdrop color semi-transparent but visible

### Mobile Tests
- [ ] Layout responsive on small screens
- [ ] Trigger bar fully accessible
- [ ] Main drawer fits on screen (doesn't overflow)
- [ ] Product drawers work on mobile

---

## Layout 4: Film Strip

### Setup
- Add 3-4 products
- Set layout to "Film Strip"

### Desktop Tests
- [ ] Products display in horizontal carousel
- [ ] First product has is-active state (full opacity)
- [ ] Other products faded (opacity 0.35)
- [ ] Scroll/swipe carousel left-right
- [ ] Numbered indicator dots show at bottom of image
- [ ] Active dot is white, others semi-transparent
- [ ] Scrolling carousel syncs dot positions
- [ ] Each product has plus button visible
- [ ] Click plus → drawer opens for that product
- [ ] Drawers independent across carousel positions
- [ ] Size/qty/add-to-cart work while carousel scrolled
- [ ] Product counter shows "X / Y" format

### Mobile Tests
- [ ] Carousel scrolls smoothly on touch
- [ ] Indicator dots responsive
- [ ] Drawers work while carousel at different positions

---

## Layout 5: Mosaic Immersive

### Setup
- Add 3-4 products
- Set layout to "Mosaic Immersive"

### Desktop Tests
- [ ] Full-screen image background
- [ ] Products displayed as mosaic at bottom
- [ ] Products scroll horizontally
- [ ] On hover: product card lifts (translateY)
- [ ] "Shop" button fades in on hover
- [ ] Plus button visible on each product
- [ ] Click plus → drawer opens
- [ ] Size/qty/add-to-cart work identically
- [ ] Multiple drawers can open independently
- [ ] Text is white with proper contrast

### Mobile Tests
- [ ] Layout responsive
- [ ] Plus button always visible
- [ ] Mosaic scrolls smoothly
- [ ] Drawers accessible and functional

---

## Edge Cases & Error Handling

### Size Selection Validation
- [ ] Try to add to cart WITHOUT selecting size
  - Expected: Alert "Please select a size"
  - Button remains enabled for retry

### Quantity Boundaries
- [ ] Qty at 1, click minus → stays at 1 (no negative)
- [ ] Qty at 1, click minus multiple times → stays at 1
- [ ] Qty increment works up to high numbers (10+)

### Race Conditions
- [ ] Rapidly click + button 5+ times → quantities increment sequentially
- [ ] Rapidly click "ADD TO CART" twice
  - Expected: Only ONE cart request sent
  - Button disabled on first click, prevents duplicate

### Network Errors
- [ ] Open DevTools → Network tab → Throttle to "Offline"
- [ ] Click "ADD TO CART"
  - Expected: Error alert appears
  - Button re-enabled for retry
  - Can retry after network restored

### Multi-Item Cart
- [ ] Add product Size M qty 1
- [ ] Open drawer again, select Size L qty 2
- [ ] Click "ADD TO CART"
- [ ] Verify both items in cart (cart count = 3)

### Image Loading
- [ ] Check Network tab for product images
- [ ] All product images load without 404s
- [ ] Images have correct alt text

### Cart Updates
- [ ] After add-to-cart, cart count in header updates
- [ ] Clicking on cart shows newly added items
- [ ] Item prices display correctly

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
  - Plus buttons
  - Size selection buttons
  - Qty buttons
  - Close button (X)
  - Add-to-cart button
- [ ] Focus outlines visible on all buttons
- [ ] Enter key activates buttons

### Screen Reader (if available)
- [ ] Plus button has aria-label: "Open size and add to cart"
- [ ] Close button has aria-label: "Close"
- [ ] Size buttons announce their size value
- [ ] Add-to-cart button announces clearly

### Color Contrast
- [ ] Black text on white background passes WCAG AA
- [ ] White text on dark background passes WCAG AA
- [ ] Selected state (black bg) has sufficient contrast

### Responsive Text
- [ ] Text sizes readable at 375px and 1400px
- [ ] No horizontal scroll at any viewport

---

## Console & Network Checks

### Browser Console (F12)
- [ ] No JavaScript errors
- [ ] No 404 errors for JS/CSS files
- [ ] Custom event `cart:updated` fires after add-to-cart
- [ ] No memory leaks (check for growing listeners)

### Network Tab
- [ ] `amm-shop-the-look.js` loads once
- [ ] `amm-shop-the-look.css` loads once
- [ ] `/cart/add.js` POST request succeeds
- [ ] Response includes correct item IDs and quantities

### Performance
- [ ] Page loads in under 3 seconds
- [ ] Drawer animation is smooth (60fps)
- [ ] No janky interactions

---

## Final Checks

### Theme Check
```bash
shopify theme check
```
- [ ] No errors related to `amm-shop-the-look`
- [ ] All sections pass validation

### Push Theme
```bash
shopify theme push
```
- [ ] All files upload successfully
- [ ] No conflicts with existing theme

---

## Test Results Summary

| Layout | Desktop | Mobile | Edge Cases | Accessibility |
|--------|---------|--------|------------|----------------|
| Editorial Split | [ ] | [ ] | [ ] | [ ] |
| Hotspot Interactive | [ ] | [ ] | [ ] | [ ] |
| Cinematic Drawer | [ ] | [ ] | [ ] | [ ] |
| Film Strip | [ ] | [ ] | [ ] | [ ] |
| Mosaic Immersive | [ ] | [ ] | [ ] | [ ] |

---

## Issues Found

### Critical Issues (Blocks Release)
(None documented yet — update as found)

### Minor Issues (Can be fixed post-release)
(None documented yet — update as found)

### Notes
(Add any observations, browser-specific issues, etc.)

---

## Sign-Off

- [ ] All layouts tested and passing
- [ ] Edge cases handled
- [ ] Accessibility verified
- [ ] Theme check passing
- [ ] Ready for commit

**Tester Name:** ________________  
**Date:** ________________  
**Signed:** ________________
