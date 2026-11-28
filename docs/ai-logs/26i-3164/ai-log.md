# AI Usage Log — Aymen Niaz (26i-3164)

**Project:** The Sweet Oven (SE-D Group 10 — Home Bakery)  
**Member:** Aymen Niaz (`26i-3164`)  
**Assigned Pages:** Cart (`pages/cart.html`), Checkout (`pages/checkout.html`), Order Confirmation (`pages/order-confirmation.html`)  
**Updated:** 2026-11-28

---

## Prompts Used

### Prompt 1 — Repository Audit
> "i am building cart,checkout,order confirmation for 'The Sweet Oven',a home bakery website(group project theme:Home bakery).The repository is already setup. Read the project folder first and tell me what exists."

### Prompt 2 — Alignment & Feature Fixes
> "Yes, please fix all 4 issues now. Do it step-by-step:
> 1. Fix CSS link: Change all my 3 pages (cart.html, checkout.html, order-confirmation.html) to use shared stylesheet css/styles.css, NOT ../css/style.css. Keep my own css/cart.css, css/checkout.css also linked after it. Do NOT edit css/styles.css.
> 2. Fix Header/Footer: Replace my custom brown header/footer with the shared header/footer from pages/login.html. Use same .navbar, logo.svg, and shared layout. Keep Bootstrap 5 CSS only, NO Bootstrap JS.
> 3. Fix Hamburger: Add vanilla JS hamburger toggle in js/cart.js / js/checkout.js to expand/collapse #mainNavbar on mobile. No Bootstrap JS.
> 4. Fix Minimum Order: Add Minimum Order Subtotal validation, NOT minimum quantity. Rule: Minimum order subtotal = PKR 1000 to proceed to checkout / place order. If subtotal < 1000, show error 'Minimum order Rs. 1000 required' and disable Place Order button. If subtotal >= 1000, allow checkout.
> 5. Add Google Fonts (Playfair Display / Nunito) and `<a class="skip-link" href="#main-content">` to cart.html, checkout.html, order-confirmation.html like in pages/login.html.
> Do NOT edit other members' pages. Only fix my 3 pages. After fixing, show me what files you changed."

### Prompt 3 — Documentation Update
> "create docs/ai-log/26i-3164/ai-log.md for Aymen 26i-3164.List the prompt i used , what you have built and changed for pages,carts.html,checkout.html and order confirmation.html and that verification passed Also update README.md Feature Table row for 26i-3164 with my 3 pages and features built.Don't touch other members rows"

---

## What Was Built & Changed

### 1. Cart Page (`pages/cart.html`, `css/cart.css`, `js/cart.js`)
- Linked Google Fonts (`Nunito`, `Playfair Display`), Bootstrap 5.3.3 CSS (CSS-only via CDN), shared `../css/styles.css`, and page-specific `../css/cart.css`.
- Added accessibility skip link (`<a class="skip-link" href="#main-content">`) and `<main id="main-content">`.
- Replaced the custom header and footer with the shared `.navbar` header (`../images/logo.svg`, `.navbar-toggler`, `#mainNavbar`, `#navCartCount`) and shared `.site-footer` from `pages/login.html`.
- Removed conflicting header/footer/body CSS overrides from `css/cart.css` and added `.min-order-alert` styling and `.nav-badge` styling for the navbar cart counter.
- Implemented `initNavbarToggle()` in `js/cart.js` using vanilla JavaScript to toggle `.show` and `aria-expanded` on `#mainNavbar` for mobile screens without Bootstrap JS.
- Implemented `MIN_ORDER_SUBTOTAL = 1000` validation in `js/cart.js`:
  - Displays `"Minimum order Rs. 1000 required..."` in `#minOrderWarning` and disables `#proceedCheckoutBtn` whenever the basket is non-empty and `subtotal < 1000`.
  - Blocks checkout click navigation with `"Minimum order Rs. 1000 required"` feedback when subtotal is below PKR 1,000.
- Preserved existing `localStorage` cart persistence (`sweetOvenCart`, `sweetOvenCartInitialized`, `sweetOvenPromo`), quantity `+/-` and numeric inputs (`1–20`), item removal/clear/restore, `SWEET10` 10% discount code, and "Fresh From the Oven" catalog search/quick-add.

### 2. Checkout Page (`pages/checkout.html`, `css/checkout.css`, `js/checkout.js`)
- Linked Google Fonts (`Nunito`, `Playfair Display`), Bootstrap 5.3.3 CSS via CDN, shared `../css/styles.css`, and page-specific `../css/checkout.css`.
- Added `<a class="skip-link" href="#main-content">`, `<main id="main-content">`, and the shared header/footer from `pages/login.html`.
- Removed conflicting header/footer/body/form overrides from `css/checkout.css` and added `.min-order-banner` styling.
- Implemented `initNavbarToggle()` in `js/checkout.js` to expand/collapse `#mainNavbar` in vanilla JS without Bootstrap JS.
- Implemented `MIN_ORDER_SUBTOTAL = 1000` validation in `js/checkout.js`:
  - Shows `#minOrderAlert` (`"Minimum order Rs. 1000 required..."`) and disables `#placeOrderBtn` when `subtotal < 1000`.
  - Prevents order submission in the `submit` handler if `summary.subtotal < 1000`.
- Preserved Islamabad/Rawalpindi delivery zones (`deliveryAreas` + free F-8/3 kitchen pickup), time slots (`deliverySlots`), payment options (`COD`, `JazzCash/Easypaisa`, `Bank Transfer IBFT/Raast` with conditional `txnRef`), field validation, draft auto-save (`sweetOvenCheckoutDraft`), and `TSO-YYYY-XXXX` order creation.

### 3. Order Confirmation Page (`pages/order-confirmation.html`, `css/order-confirmation.css`, `js/order-confirmation.js`)
- Linked Google Fonts (`Nunito`, `Playfair Display`), Bootstrap 5.3.3 CSS via CDN, shared `../css/styles.css`, and page-specific `../css/order-confirmation.css`.
- Added `<a class="skip-link" href="#main-content">`, `<main id="main-content">`, and the shared header/footer from `pages/login.html` (keeping `no-print` on the footer for clean receipt printing).
- Removed conflicting header/footer/body CSS rules from `css/order-confirmation.css` while preserving receipt/timeline styling and `@media print`.
- Implemented `initNavbarToggle()` in `js/order-confirmation.js` for vanilla JS mobile navigation toggling on `#mainNavbar`.
- Preserved `localStorage` order loading (`sweetOvenLastOrder`, `sweetOvenOrders`), Order ID lookup (`TSO-YYYY-XXXX`), 4-stage baking timeline, itemized receipt, copy Order ID, and print receipt controls.

---

## Verification Passed
- **Git Isolation (`git status -sb`):** Confirmed only Aymen's 9 files (`pages/cart.html`, `pages/checkout.html`, `pages/order-confirmation.html`, `css/cart.css`, `css/checkout.css`, `css/order-confirmation.css`, `js/cart.js`, `js/checkout.js`, `js/order-confirmation.js`) were modified; `css/styles.css` and all other group members' pages remained untouched.
- **HTML & CSS Link Checks (`Select-String`):** Confirmed all 3 HTML pages load Google Fonts (`Nunito`, `Playfair Display`), Bootstrap 5.3.3 CSS only (no Bootstrap JS bundle or jQuery), `../css/styles.css`, their page-specific stylesheet, `.skip-link`, `.navbar-toggler`, and `#mainNavbar`.
- **JS Wiring Checks (`Select-String`):** Confirmed `js/cart.js`, `js/checkout.js`, and `js/order-confirmation.js` reference `#mainNavbar` / `.navbar-toggler` (with old `navToggle` / `primaryMenu` removed), and `js/cart.js` and `js/checkout.js` enforce `MIN_ORDER_SUBTOTAL = 1000`.
- **Environment Note:** `node` was not installed in the local workspace environment, so automated CLI JS execution was not available; live browser verification is recommended for interactive DOM testing.
