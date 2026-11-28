# AI Usage Log — Abdullah Shahid (26i-3211)

**Project:** The Sweet Oven (SE-D Group 10 — Home Bakery)  
**Member:** Abdullah Shahid (`26i-3211`)  
**Assigned Pages:** Menu (`pages/menu.html`), Item Details (`pages/item-details.html`), Custom Cake Request (`pages/custom-cake.html`)  
**Shared Data / Scripts:** `js/bakery-data.js`, `js/bakery-shared.js`, `css/menu.css`, `css/item-details.css`, `css/custom-cake.css`  
**Updated:** 2026-11-28  

---

## Duties & Responsibilities
- **Pages:** Menu, Item Details page, Custom Cake page
- **Data and Display:** Menu with Filter, Sort, Search
- **Forms and Input:** Cake Request Form
- **State and Memory:** Recently Viewed Items
- **Interaction:** Details modal, allergen tab
- **Logic and Calculations:** Cake quote by size and flavour
- **Responsiveness and Accessibility:** Grid reflows to one column, hamburger menu on mobile, semantic tags, alt text, and form labels.

---

## Prompts Used

### Prompt 1 — Repository Audit & Requirements Review
> "I am building Menu, Item Details page, Custom Cake page for 'The Sweet Oven', a home bakery website (group project, theme: Home bakery). The repository is already set up. Read the project folder first and tell me what exists.
> Rules:
> * Use only HTML5, CSS3 and vanilla JavaScript. Bootstrap:yes, Use Bootstrap 5 via CDN for CSS only. Do not use Bootstrap's JavaScript. Write all interactions in vanilla JavaScript., No other frameworks, no jQuery.
> * Use the existing shared files: css/style.css, and the shared header and footer from the shared layer. Do not edit other members' pages or the shared CSS. Put my page styles in css/[my-page].css.
> * Put JavaScript in js/, images in images/. Use relative links only.
> * Use semantic tags (header, nav, main, footer), alt text on every image, labels on every form field.
> * Realistic content only: real item names and prices in PKR. No lorem ipsum.
> * Page content must be generated from JavaScript data (arrays in js/) wherever it is a list.
> * Handle edge cases: empty states, invalid input, no results.
> * Save state with localStorage where it should survive a reload.
> * Responsive: desktop and mobile, a hamburger menu on small screens.
> * Colours: cream #FFF8EE, brown #4A2C1D, caramel #B5601E, pink #F3B6C0.
> For now, please review and tell me the details etc. Don't do anything and just Audit."

### Prompt 2 — Documentation & Verification Update
> "yes" (Proceed with populating README feature/contribution tables, documenting AI usage log, and performing requirement validations).

---

## What Was Built & Verified

### 1. Menu Page (`pages/menu.html`, `css/menu.css`, `js/menu.js`)
- **Header & Tagline:** Heading `"Our Menu"` with tagline `"Delicious cakes for every occasion!"`.
- **Category Filter Chips:** Horizontal chips: **All** (selected in pink by default), **Cakes**, **Cupcakes**, **Custom**, plus bakery categories (Milk Cakes, Brownies & Bars, Pastries & Cookies).
- **Product Grid:** Generated dynamically from `js/bakery-data.js` with realistic Pakistani prices:
  - Chocolate Cake — Rs. 1,800
  - Strawberry Cake — Rs. 1,800
  - Vanilla Cake — Rs. 1,600
  - Red Velvet Cake — Rs. 1,900
  - Red Velvet Cupcakes — Rs. 1,500
  - Hazelnut Praline Cake — Rs. 2,400
  - Lotus Biscoff Tres Leches — Rs. 1,200
  - Pistachio Kunafa Tres Leches — Rs. 1,450
- **Card Click & Quick Add:** Clicking any product card navigates to `item-details.html?id=[itemId]`. Clicking the pink `"Add to Cart"` button adds one item and syncs with navbar basket count.
- **Filter, Sort & Search:**
  - Live search input matching names, descriptions, and ingredients with a clear button.
  - Sort dropdown: Featured First, Price: Low to High, Price: High to Low, Name: A to Z, Highest Rated.
  - Dietary filters (Best Seller, Eggless Option, Nut-Free) with filter reset capability.
- **Quick-View Modal:** Accessible modal dialog with Ingredients, Allergens, and Storage tabs, quantity stepper, and quick add, written purely in vanilla JS (no Bootstrap JS).
- **Empty State:** `#menuEmptyState` displayed when zero search results match, with a button to reset all filters.
- **State Persistence:** Filter, search, and category selections persist across page reloads via `localStorage` (`sweetOvenMenuState`).

### 2. Item Details Page (`pages/item-details.html`, `css/item-details.css`, `js/item-details.js`)
- **Product Showcase:** Large cake illustration presented inside a warm soft peach showcase box (`#FCE8D5`).
- **Product Information:**
  - Cake Name: e.g. "Chocolate Cake"
  - Price in pink/crimson: e.g. "Rs. 1,800"
  - Rating: Five gold stars with `4.8 (1.2k reviews)`
  - Short description: `"Rich chocolate cake with smooth cream."`
- **Quantity Stepper & Cart Integration:** Custom `− 1 +` stepper paired with wide pink `"Add to Cart"` button that adds the exact quantity selected.
- **Size / Variant Selection:** Allows selecting between Small (1kg), Large (2kg), or Eggless options with live price updates.
- **"You Might Also Like":** 3 compact square thumbnails (Strawberry Cake, Chocolate Cake, Red Velvet Cake) linking to their respective details pages.
- **Allergen Guide & Nutrition Tabs:** Interactive tabs (Ingredients, Allergens, Storage) plus an "Allergen & Details Modal".
- **State & Memory (`localStorage`):**
  - **Recently Viewed Items:** Automatically tracks viewed items in `sweetOvenRecentItems` (survives browser reload) and renders them below the recommendations.
- **Edge Case Handling:** Dedicated `#itemNotFound` view with fallback navigation when an invalid or non-existent product ID is requested.

### 3. Custom Cake Request Page (`pages/custom-cake.html`, `css/custom-cake.css`, `js/custom-cake.js`)
- **Header & Tagline:** Heading `"Design Your Cake"` with tagline `"Create your perfect cake!"`.
- **5-Step Process Flow Diagram / Progress Indicator:**
  1. *Step 1:* Upload Design (or Choose Option) (icon: `image`)
  2. *Step 2:* Select Cake Size (icon: `tiered cake`)
  3. *Step 3:* Choose Flavor (icon: `droplet`)
  4. *Step 4:* Add Message (Optional) (icon: `note with pencil`)
  5. *Step 5:* Place Order (icon: `checkmark in a circle`)
- **Step 1 Upload Box:** Dashed-border drag-and-drop upload container with camera icon (`"Upload Your Design (or choose an option)"`) + preset design selector.
- **Step 2 Size Dropdown:** Defaults to `"Small (1kg)"` with choices for 2kg, 3kg, and two-tier cakes.
- **Step 3 Flavor Dropdown:** Defaults to `"Chocolate"` with Red Velvet, Vanilla Bean, Salted Caramel, Lotus Biscoff, and Pistachio.
- **Step 4 Message Field:** Input with placeholder `"e.g. Happy Birthday!"` and live 50-character counter.
- **Step 5 Place Order:** Wide pink `"Place Order"` button validating date (min 48 hours notice), delivery area, name, and phone.
- **Logic & Calculations:**
  - Sticky live pricing calculation breaking down Base Cake Size, Flavor Upgrades, Dietary Adjustments, Toppings, and Delivery Fee in PKR.
- **Draft & Order Persistence:**
  - In-progress customizations auto-save in `localStorage` under `sweetOvenCustomCakeDraft`.
  - Placed orders are saved to `sweetOvenCustomCakeRequests` and listed in "Your Saved Custom Cake Orders".

---

## Technical & Architecture Compliance

1. **Framework Restrictions:** Pure HTML5, CSS3, and vanilla JavaScript only. Bootstrap 5.3.3 is linked via CDN strictly for layout/grid CSS; **no Bootstrap JS bundle and no jQuery** are used anywhere.
2. **Shared Layer & Style Isolation:**
   - Shared `css/styles.css` is preserved and loaded first across all pages.
   - All custom styles are isolated in `css/menu.css`, `css/item-details.css`, and `css/custom-cake.css`.
   - Brand color palette adhered to: Cream (`#FFF8EE`), Brown (`#4A2C1D`), Caramel (`#B5601E`), Pink (`#F3B6C0`).
3. **Accessibility:** Semantic tags (`<header>`, `<nav>`, `<main>`, `<footer>`), `<a class="skip-link">`, explicit `<label>` elements for every input, and descriptive `alt` text on every image.
4. **Responsive Design:** Fluid multi-column desktop grid that reflows to a single column on mobile devices. Vanilla JS navbar toggle on small screens.
