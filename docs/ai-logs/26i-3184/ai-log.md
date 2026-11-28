# AI Log — Muhammad Abdullah Hassan (26i-3184)

**Project:** SE-D Group 10 — The Sweet Oven  
**Branch:** `i263184`  
**Pages Owned:** Home (`index.html`), About (`pages/about.html`), Contact & Delivery (`pages/contact.html`)  
**AI Tool Used:** Google Antigravity (Gemini 2.5 Pro)  
**Sessions:** 2 (November 27–28, 2026)

---

## Session 1 — November 27, 2026

### Goal
Build Home, About, and Contact & Delivery pages from scratch to match the prototype wireframe while keeping all extended features (carousel, delivery checker 4-states, dietary prefs, etc.).

### Prompts Used (representative sample)

1. *"I am building Home, About, Contact & Delivery for 'The Sweet Oven', a home bakery website (group project). Read the project folder first and tell me what exists."*  
   → AI audited the repo structure, identified existing shared files, and listed all teammates' pages.

2. *"Build all three pages following these rules: Bootstrap 5 CSS CDN only, vanilla JS, semantic HTML5, PKR prices, JS arrays for all content, localStorage for state, responsive with hamburger menu, prototype layout as described…"*  
   → AI generated `index.html`, `pages/about.html`, `pages/contact.html` with full CSS and JS files.

3. *"Keep the extra stuff while trying to be as true as possible to the original prototype. Tell me what should our next steps be."*  
   → AI audited all three pages for prototype fidelity and identified gaps, then proposed fixes.

4. *"Yes"* (proceed with all fixes)  
   → AI rewrote all pages, CSS files, and JS files to match prototype layout at the top while restoring extra sections below the fold.

5. *"Pull from main again using git fetch origin"*  
   → AI ran `git fetch origin` and `git merge origin/main` three times (required `BypassSandbox: true` for `.git/` write permissions in the sandbox environment).

---

## Session 2 — November 28, 2026

### Goal
Verify post-merge state, commit all changes, push to `i263184`, and write this AI log.

### Prompts Used

1. *(Resumed from summary)* Checked `git status --short` and `git log --oneline -5` to verify merge was clean.
2. Ran `node --check` on all three JS files — no syntax errors.
3. Staged 14 files (9 modified, 4 new SVGs, 2 deleted stray transcript files).
4. Committed with descriptive message and pushed to `origin i263184`.

---

## Files Implemented

| File | Description |
|---|---|
| `index.html` | Home page — hero, Best Sellers carousel, 3-icon highlights, category filter, search/sort, Weekly Schedule, Customer Highlights, Newsletter |
| `pages/about.html` | About page — Meet the baker, How we bake (3-step flow), Bakery Stats, Journey Timeline, Ingredients grid, Dietary Preferences |
| `pages/contact.html` | Contact page — Contact form (3 inputs + textarea), Delivery checker (4 states), Contact channels, Delivery zones, Inquiry history, Guidelines |
| `css/home.css` | Home page styles + Cozy dark theme |
| `css/about.css` | About page styles + Cozy dark theme |
| `css/contact.css` | Contact page styles + Cozy dark theme |
| `js/home.js` | Data arrays + rendering: `featuredBakes[]`, carousel, category filter, search/sort, newsletter, remembered-visit |
| `js/about.js` | Data arrays + rendering: `bakingSteps[]`, stats, timeline, ingredients, dietary prefs |
| `js/contact.js` | Data arrays + rendering: `deliveryZones[]`, contact form validation + draft autosave, delivery checker, channels, zones, guidelines, inquiry history |
| `images/chef-hat.svg` | Chef hat icon for About page |
| `images/icon-cupcake.svg` | Cupcake icon for home highlights |
| `images/icon-cake-slice.svg` | Cake slice icon for home highlights |
| `images/icon-delivery-truck.svg` | Delivery truck icon for home highlights |

---

## Features Implemented

### Home Page
- **Best Sellers Carousel** — 3 cards/slide, rendered from `featuredBakes[]` JS array, `Add` button increments `sweetOvenCart` localStorage key and updates `Cart (N)` badge in navbar
- **Category Filter Pills** — filter by category from JS array
- **Search & Sort** — real-time name search + sort by price/name, persisted in `sweetOvenHomePrefs` localStorage
- **Weekly Bake Schedule** — today's item highlighted, rendered from `weeklyBakeSchedule[]` array
- **Customer Highlights** — testimonial cards from `customerHighlights[]` array
- **Newsletter** — subscribe/unsubscribe with `sweetOvenNewsletter` localStorage
- **Remembered Visit** — banner on first visit vs. returning visit, using `sweetOvenLastVisit` localStorage
- **Cozy Dark Theme Toggle** — persisted via `sweetOvenTheme` localStorage

### About Page
- **How We Bake** — 3-step flow with square boxes + arrows, rendered from `bakingSteps[]` JS array
- **Bakery Stats** — 4 stat cards from `bakerStats[]` array
- **Journey Timeline** — 4 milestone cards from `storyMilestones[]` array
- **Ingredients Grid** — filterable by tag, from `qualityIngredients[]` array, filter state saved in `sweetOvenIngredientFilter`
- **Dietary Preferences** — checkbox form, saves/removes chip pills, persisted in `sweetOvenDietaryPrefs`

### Contact & Delivery Page
- **Contact Form Validation** — required fields (name, email, subject, message), email format validation, field-level error messages, success/error banner
- **Draft Autosave** — form draft persisted in `sweetOvenContactDraft` localStorage, restored on page load
- **Inquiry History** — sent messages saved to `sweetOvenContactInquiries`, displayed in collapsible history section
- **Delivery Checker — 4 States:**
  1. *None* — no area selected yet (default)
  2. *Served* — area found in `deliveryZones[]` → shows fee, slot, estimated time
  3. *Unserved* — area not found → "Sorry, we don't deliver there yet"
  4. *Saved* — served area, user clicks "Save to Order Note" → updates `sweetOvenPreferredArea`, `sweetOvenPreferredSlot`, `sweetOvenDeliveryOrderNote`
- **Delivery Zones Grid** — searchable, filterable by zone type, rendered from `deliveryZones[]`
- **Contact Channels** — rendered from `contactChannels[]` array
- **Delivery Guidelines** — rendered from `deliveryGuidelines[]` array

---

## Verification Steps Performed

| Check | Result |
|---|---|
| `node --check js/home.js` | ✅ No syntax errors |
| `node --check js/about.js` | ✅ No syntax errors |
| `node --check js/contact.js` | ✅ No syntax errors |
| Semantic HTML tags used (`<header>`, `<nav>`, `<main>`, `<footer>`) | ✅ |
| All `<img>` have `alt` attributes | ✅ |
| All form fields have `<label for="...">` | ✅ |
| No Bootstrap JavaScript used | ✅ |
| No jQuery or external JS | ✅ |
| All prices in PKR | ✅ |
| All content rendered from JS arrays | ✅ |
| `localStorage` keys consistent across pages | ✅ |
| `:focus-visible` outlines (3px caramel) | ✅ |
| Responsive hamburger menu on mobile | ✅ |
| `git merge origin/main` — no conflicts | ✅ |
| `git push origin i263184` — successful | ✅ |

---

## localStorage Keys

| Key | Used By | Purpose |
|---|---|---|
| `sweetOvenCart` | home.js, contact.js | Cart item array (shared with cart.js/checkout.js) |
| `sweetOvenTheme` | home.js, about.js, contact.js | Cozy dark theme preference |
| `sweetOvenLastVisit` | home.js | Remembered visit banner |
| `sweetOvenHomePrefs` | home.js | Search/sort preferences |
| `sweetOvenNewsletter` | home.js | Newsletter subscription state |
| `sweetOvenDietaryPrefs` | about.js | Dietary preference chips |
| `sweetOvenIngredientFilter` | about.js | Active ingredient category filter |
| `sweetOvenPreferredArea` | contact.js | Saved delivery area from checker |
| `sweetOvenPreferredSlot` | contact.js | Saved delivery slot from checker |
| `sweetOvenDeliveryOrderNote` | contact.js | Delivery note (passed to checkout) |
| `sweetOvenContactDraft` | contact.js | Auto-saved contact form draft |
| `sweetOvenContactInquiries` | contact.js | Sent inquiry history |

---

## AI Assistance Notes

- The AI generated all HTML structure, CSS styles, and JavaScript logic for the three pages.
- All content (product names, prices, baking steps, delivery zones, bios) was provided/approved as realistic PKR-priced bakery content — no lorem ipsum.
- The AI performed multiple audits comparing the prototype description to the generated output and iteratively refined the layout.
- The student reviewed all generated code for correctness and approved each stage before proceeding.
- Git operations (`fetch`, `merge`, `push`) were performed by the AI but required elevated sandbox permissions due to `.git/` directory write restrictions in the AI sandbox.
