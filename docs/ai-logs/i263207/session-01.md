# AI Session Log — Session 01

- **Project:** The Sweet Oven (SE-D Group 10 — Home Bakery)
- **Branch:** `i263207`
- **Date:** 2026-11-27
- **Scope:** Build `Offers`, `Party Calculator`, and `FAQ` pages using HTML5, CSS3, Bootstrap 5.3.3 (CSS only via CDN), and vanilla JavaScript.

---

## 1. Repository Inspection
- Inspected the project directory and pulled from `origin/main` (already up to date).
- Verified presence of `css/style.css` (`368` lines) defining the brand palette (`#FFF8EE`, `#4A2C1D`, `#B5601E`, `#F3B6C0`), typography (`Playfair Display` and `Nunito`), and shared header, footer, button, card, and form styles.
- Left `css/style.css`, `index.html`, and `README.md` unmodified.

---

## 2. Files Created

### HTML Pages (`pages/`)
- `pages/offers.html` — Offers & Combos page with semantic layout (`header`, `nav`, `main`, `section`, `article`, `footer`), Bootstrap 5.3.3 CSS CDN, `../css/style.css`, `../css/offers.css`, `../js/nav.js`, and `../js/offers.js`.
- `pages/party-calculator.html` — Party Calculator page with labeled form controls, occasion presets, item selection, live estimate summary, and saved plans section.
- `pages/faq.html` — FAQ page with topic filters, search input, expand/collapse controls, vanilla JS accordion, and "Still Have a Question?" form.

### Page-Specific Styles (`css/`)
- `css/offers.css`
- `css/party-calculator.css`
- `css/faq.css`

### Vanilla JavaScript (`js/`)
- `js/nav.js` — Mobile hamburger menu toggle (`.navbar-toggler` / `#mainNavbar`) and Escape-key close without Bootstrap JS or jQuery.
- `js/offers.js` — Renders offers and category filters from `OFFERS_DATA` and `OFFER_CATEGORIES`, handles search/sort, promo code copy (`SWEET10` and combo codes), empty/no-results state, and `localStorage` persistence (`sweetOvenSavedOffers`, `sweetOvenOffersFilterState`, `sweetOvenCart`).
- `js/party-calculator.js` — Generates occasion presets (`OCCASION_PRESETS`) and bakery items (`PARTY_ITEMS`), validates guest count (`5–500` whole numbers), optional budget target, and empty item selections, and persists form state (`sweetOvenPartyFormState`) and named plans (`sweetOvenSavedPartyPlans`) in `localStorage`.
- `js/faq.js` — Generates topic filters (`FAQ_CATEGORIES`) and accordion items (`FAQ_ITEMS`), handles search/filter/expand-all/collapse-all, empty/no-results state, validated question submission, and `localStorage` persistence (`sweetOvenFaqState`, `sweetOvenFaqQuestions`).

### Images (`images/`)
- `images/logo.svg`
- `images/offer-tea-box.svg`
- `images/offer-birthday-bundle.svg`
- `images/offer-brownie-box.svg`
- `images/offer-festive-platter.svg`

---

## 3. Verification Performed
- Verified via PowerShell script that `pages/offers.html`, `pages/party-calculator.html`, and `pages/faq.html` contain no Bootstrap JS or jQuery references (`BootstrapJS/jQuery=False`) and that all `<img>` tags include non-empty `alt` attributes (`missingAlt=0`).
- `node` was not installed in the environment, so `node --check` was skipped.
