# AI Usage Log — Aymen Niaz (26i-3164)

**Project:** The Sweet Oven (SE-D Group 10)  
**Member:** Aymen Niaz (`26i-3164`)  
**Assigned Pages:** Cart (`pages/cart.html`), Checkout (`pages/checkout.html`), Order Confirmation (`pages/order-confirmation.html`)

---

## Prompts Used

### Prompt 1
> "I am Aymen 26i-3164. Build Cart, Checkout, Order-Confirmation for The Sweet Oven. Use HTML5, CSS3, vanilla JS, Bootstrap 5 via CDN for CSS only, no Bootstrap JS, no jQuery. Files: pages/cart.html, pages/checkout.html, pages/order-confirmation.html, css/cart.css, css/checkout.css, css/order-confirmation.css, js/cart.js, js/checkout.js, js/order-confirmation.js. Use cartItems array, localStorage, SWEET10 discount, real prices in PKR."

### Prompt 2
> "Verify my files - check semantic tags, Bootstrap CSS only, alt text, labels, JS errors."

---

## Files & Features Implemented

### 1. Shopping Basket — `pages/cart.html`, `css/cart.css`, `js/cart.js`
- Built the basket interface with a responsive header/navigation bar, 3-step order progress indicator (`Basket` → `Checkout` → `Confirmation`), and footer.
- Implemented `cartItems` state persisted in `localStorage` (`sweetOvenCart`, `sweetOvenCartInitialized`, `sweetOvenPromo`) with real PKR pricing and a 3-item default sample basket (`defaultCartItems`).
- Added quantity increment/decrement buttons and direct numeric input (capped at `MAX_ITEM_QTY = 20`), item removal, clear basket, and restore sample basket actions.
- Added `SWEET10` promo code form (10% discount calculation and removal) and live subtotal/discount/total summary updates.
- Built the "Fresh From the Oven" quick-add catalog (`bakeryCatalog`) with live keyword search filtering and add-to-basket buttons.

### 2. Checkout — `pages/checkout.html`, `css/checkout.css`, `js/checkout.js`
- Built the checkout form and live order summary sidebar synced with `localStorage` (`sweetOvenCart`, `sweetOvenPromo`) and an empty-basket warning state.
- Implemented Islamabad & Rawalpindi delivery zones (`deliveryAreas`, including free `F-8/3` self-pickup and tiered delivery fees from `PKR 200` to `PKR 450`) and 3 delivery time slots (`deliverySlots`).
- Implemented payment method options (`paymentMethods`): Cash on Delivery (`cod`), JazzCash / Easypaisa Mobile Wallet (`jazzcash`), and Bank Transfer IBFT/Raast (`bank`) with conditional transaction reference (`txnRef`) validation.
- Added client-side validation for full name, Pakistani mobile number (`03XX-XXXXXXX` / `+923XXXXXXXXX`), email, delivery area, street address, future/today delivery date, time slot, optional special notes (200-character counter), and confirmation checkbox, plus checkout draft auto-save (`sweetOvenCheckoutDraft`).
- Generated `TSO-YYYY-XXXX` order IDs, saved completed orders to `sweetOvenLastOrder` and `sweetOvenOrders` in `localStorage`, cleared the cart/promo/draft on submission, and redirected to `order-confirmation.html`.

### 3. Order Confirmation & Receipt — `pages/order-confirmation.html`, `css/order-confirmation.css`, `js/order-confirmation.js`
- Built the order confirmation receipt page reading `sweetOvenLastOrder` and `sweetOvenOrders` from `localStorage`, with a fallback state when no saved order exists.
- Added an Order ID lookup form (`TSO-YYYY-XXXX`) to load any previously saved order from `sweetOvenOrders`.
- Implemented a 4-stage baking/delivery timeline (`Order Confirmed`, `Freshly Baking`, `Frosting & Quality Check`, `Out for Delivery` / `Ready for Pickup`), itemized receipt breakdown, payment/delivery details, clipboard copy for the Order ID, and print-friendly receipt styling (`@media print`).

### 4. Visual Assets (`images/`)
- Created 7 SVG bakery illustrations and logo assets:
  - `images/sweet-oven-logo.svg`
  - `images/almond-croissants.svg`
  - `images/caramel-walnut-brownies.svg`
  - `images/chocolate-fudge-cake.svg`
  - `images/cinnamon-rolls.svg`
  - `images/lotus-tres-leches.svg`
  - `images/red-velvet-cupcakes.svg`

---

## Verification & Observed Checks

- **Git Isolation:** `git status` confirmed `index.html` and `README.md` remained untouched while the 16 feature files (`3` HTML, `3` CSS, `3` JS, `7` SVG) were present as untracked files before documentation updates.
- **Semantic HTML5:** Inspection of `pages/cart.html`, `pages/checkout.html`, and `pages/order-confirmation.html` confirmed `<header>`, `<nav>`, `<main>`, and `<footer>` landmarks on all three pages.
- **Bootstrap CSS Only:** All three HTML pages include `bootstrap@5.3.3/dist/css/bootstrap.min.css` via CDN and load only their respective vanilla JS scripts (`../js/cart.js`, `../js/checkout.js`, `../js/order-confirmation.js`), with no Bootstrap JS and no jQuery.
- **Accessibility (`alt` text & form labels):** All static HTML `<img>` tags and dynamically created JS `<img>` elements include `alt` attributes, and all form inputs, selects, and textareas have associated `<label>` elements.
- **JS File Sizes & Manual Inspection:** Verified `js/cart.js` (690 lines), `js/checkout.js` (730 lines), and `js/order-confirmation.js` (316 lines) via full file inspection with no syntax errors observed in the source code (note: `node` and external W3C HTML/CSS validators were not available in this local environment to run automated CLI parsing, and shared site files `../css/style.css`, `menu.html`, and `offers.html` are pending from other team sections).
- **SVG Assets:** Verified all 7 SVG files exist in `images/`.
