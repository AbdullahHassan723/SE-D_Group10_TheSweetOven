/**
 * The Sweet Oven - Offers & Combos Page
 * Data-driven offers rendering, filtering, promo copy, and localStorage persistence.
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    SAVED_OFFERS: 'sweetOvenSavedOffers',
    FILTER_STATE: 'sweetOvenOffersFilterState',
    CART: 'sweetOvenCart'
  };

  const OFFER_CATEGORIES = [
    'All',
    'Tea-Time Boxes',
    'Celebration Bundles',
    'Brownie & Cookie Deals',
    'Festive Platters'
  ];

  const OFFERS_DATA = [
    {
      id: 'offer-weekend-tea',
      title: 'Weekend Hi-Tea Bakery Box',
      category: 'Tea-Time Boxes',
      badge: 'Best Seller',
      serves: 'Serves 6–8 guests',
      description: 'Warm, flaky favourites ideal for Saturday evening tea with family or guests.',
      items: [
        '4 Butter Almond Croissants',
        '4 Classic Cinnamon Rolls with Cream Cheese Glaze',
        '6 Savoury Chicken & Herb Puff Pastries'
      ],
      originalPrice: 4100,
      offerPrice: 3450,
      promoCode: 'TEATIME15',
      validUntil: 'Valid every Fri – Sun',
      image: '../images/offer-tea-box.svg',
      alt: 'Weekend Hi-Tea Bakery Box illustration with croissants and cinnamon rolls'
    },
    {
      id: 'offer-birthday-bundle',
      title: 'Birthday Celebration Bundle',
      category: 'Celebration Bundles',
      badge: 'Party Favourite',
      serves: 'Serves 12–15 guests',
      description: 'Everything you need for an effortless home birthday table, freshly frosted to order.',
      items: [
        '2 lb Belgian Chocolate Fudge Cake (custom message)',
        '12 Red Velvet Cupcakes with Cream Cheese Swirl',
        'Complimentary Gold Candles & Cake Knife'
      ],
      originalPrice: 6850,
      offerPrice: 5800,
      promoCode: 'BDAY1050',
      validUntil: 'Order 24 hours ahead',
      image: '../images/offer-birthday-bundle.svg',
      alt: 'Birthday Celebration Bundle tiered chocolate cake with pink frosting'
    },
    {
      id: 'offer-brownie-cookie',
      title: 'Fudge Brownie & Cookie Assortment',
      category: 'Brownie & Cookie Deals',
      badge: 'Student Pick',
      serves: 'Serves 6–8 guests',
      description: 'Rich, crinkle-top brownies paired with soft-baked gourmet cookies.',
      items: [
        '6 Caramel Walnut Fudge Brownies',
        '6 Double Chocolate Chunk Cookies',
        '1 Jar Salted Caramel Dip (150g)'
      ],
      originalPrice: 2850,
      offerPrice: 2400,
      promoCode: 'FUDGE450',
      validUntil: 'Available Daily',
      image: '../images/offer-brownie-box.svg',
      alt: 'Fudge Brownie and Cookie Assortment gift box'
    },
    {
      id: 'offer-lotus-family',
      title: 'Lotus Biscoff Tres Leches Tray',
      category: 'Festive Platters',
      badge: 'Chef Special',
      serves: 'Serves 10–12 guests',
      description: 'Chilled sponge soaked in three milks, topped with whipped cream and Lotus crumble.',
      items: [
        '1 Full Family Party Tray (1.5 kg)',
        'Extra Lotus Biscoff Biscuit Topping Pack',
        '200ml Warm Lotus Drizzle Sauce'
      ],
      originalPrice: 3750,
      offerPrice: 3200,
      promoCode: 'LOTUS550',
      validUntil: 'Limited Weekly Batch',
      image: '../images/offer-festive-platter.svg',
      alt: 'Lotus Biscoff Tres Leches family dessert platter'
    },
    {
      id: 'offer-office-brunch',
      title: 'Office Morning Pastry Box',
      category: 'Tea-Time Boxes',
      badge: 'Bulk Saver',
      serves: 'Serves 10–12 colleagues',
      description: 'A balanced sweet-and-savoury assortment baked early for morning meetings.',
      items: [
        '6 Classic Pain au Chocolat',
        '6 Cheese & Zaatar Croissants',
        '6 Mini Banana Walnut Loaf Slices'
      ],
      originalPrice: 4800,
      offerPrice: 4100,
      promoCode: 'OFFICE700',
      validUntil: 'Mon – Fri Morning Delivery',
      image: '../images/offer-tea-box.svg',
      alt: 'Office Morning Pastry Box with croissants and loaves'
    },
    {
      id: 'offer-mehndi-platter',
      title: 'Dholki & Family Dessert Platter',
      category: 'Festive Platters',
      badge: 'Big Savings',
      serves: 'Serves 18–22 guests',
      description: 'Bite-sized bakery treats curated for dholkis, milads, and weekend dawats.',
      items: [
        '12 Mini Nutella Tartlets',
        '12 Pistachio Cardamom Shortbread Bites',
        '12 Assorted Mini Cupcakes (Vanilla & Chocolate)'
      ],
      originalPrice: 7600,
      offerPrice: 6500,
      promoCode: 'DAWAT1100',
      validUntil: 'Order 48 hours ahead',
      image: '../images/offer-festive-platter.svg',
      alt: 'Dholki and Family Dessert Platter with assorted tartlets and cupcakes'
    }
  ];

  let state = {
    category: 'All',
    search: '',
    sort: 'featured'
  };

  function formatPKR(amount) {
    return 'PKR ' + Number(amount).toLocaleString('en-PK');
  }

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Ignore storage quota errors in restricted environments
    }
  }

  function getSavedOfferIds() {
    const saved = readStorage(STORAGE_KEYS.SAVED_OFFERS, []);
    return Array.isArray(saved) ? saved : [];
  }

  function getCartItems() {
    const cart = readStorage(STORAGE_KEYS.CART, []);
    return Array.isArray(cart) ? cart : [];
  }

  function updateNavCartBadge() {
    const badge = document.getElementById('navCartBadge');
    if (!badge) return;
    const cart = getCartItems();
    const totalQty = cart.reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 1);
    }, 0);
    badge.textContent = String(totalQty);
  }

  function showStatusBanner(message) {
    const banner = document.getElementById('offersStatusBanner');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.remove('d-none');
  }

  function renderCategoryFilters() {
    const container = document.getElementById('offerCategoryFilters');
    if (!container) return;
    container.innerHTML = '';

    OFFER_CATEGORIES.forEach(function (category) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-pill' + (state.category === category ? ' is-active' : '');
      btn.textContent = category;
      btn.setAttribute('aria-pressed', String(state.category === category));
      btn.addEventListener('click', function () {
        state.category = category;
        writeStorage(STORAGE_KEYS.FILTER_STATE, state);
        renderCategoryFilters();
        renderOffers();
      });
      container.appendChild(btn);
    });
  }

  function getFilteredOffers() {
    const query = state.search.trim().toLowerCase();

    const filtered = OFFERS_DATA.filter(function (offer) {
      const matchesCategory = state.category === 'All' || offer.category === state.category;
      if (!matchesCategory) return false;
      if (!query) return true;

      const searchable = [
        offer.title,
        offer.category,
        offer.description,
        offer.promoCode,
        offer.items.join(' ')
      ].join(' ').toLowerCase();

      return searchable.indexOf(query) !== -1;
    });

    if (state.sort === 'price-asc') {
      filtered.sort(function (a, b) { return a.offerPrice - b.offerPrice; });
    } else if (state.sort === 'price-desc') {
      filtered.sort(function (a, b) { return b.offerPrice - a.offerPrice; });
    } else if (state.sort === 'savings-desc') {
      filtered.sort(function (a, b) {
        return (b.originalPrice - b.offerPrice) - (a.originalPrice - a.offerPrice);
      });
    }

    return filtered;
  }

  function copyPromoCode(code, buttonEl) {
    const originalText = buttonEl.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(function () {});
    }
    buttonEl.textContent = 'Copied!';
    showStatusBanner('Promo code ' + code + ' copied. Apply it in your basket or at checkout.');
    setTimeout(function () {
      buttonEl.textContent = originalText;
    }, 1800);
  }

  function toggleSavedOffer(offerId) {
    const saved = getSavedOfferIds();
    const index = saved.indexOf(offerId);
    const offer = OFFERS_DATA.find(function (item) { return item.id === offerId; });

    if (index === -1) {
      saved.push(offerId);
      if (offer) showStatusBanner('Saved "' + offer.title + '" to your bookmarked offers.');
    } else {
      saved.splice(index, 1);
      if (offer) showStatusBanner('Removed "' + offer.title + '" from your saved offers.');
    }

    writeStorage(STORAGE_KEYS.SAVED_OFFERS, saved);
    renderOffers();
    renderSavedOffers();
  }

  function addOfferToBasket(offer) {
    const cart = getCartItems();
    const existing = cart.find(function (item) { return item.id === offer.id; });

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
      cart.push({
        id: offer.id,
        name: offer.title,
        price: offer.offerPrice,
        quantity: 1,
        image: offer.image,
        type: 'combo'
      });
    }

    writeStorage(STORAGE_KEYS.CART, cart);
    updateNavCartBadge();
    showStatusBanner('Added "' + offer.title + '" (' + formatPKR(offer.offerPrice) + ') to your basket.');
  }

  function renderOffers() {
    const grid = document.getElementById('offersGrid');
    const emptyState = document.getElementById('offersEmptyState');
    const resultCount = document.getElementById('offersResultCount');
    if (!grid || !emptyState || !resultCount) return;

    const offers = getFilteredOffers();
    const savedIds = getSavedOfferIds();

    grid.innerHTML = '';
    resultCount.textContent = 'Showing ' + offers.length + ' of ' + OFFERS_DATA.length + ' offers';

    if (offers.length === 0) {
      emptyState.classList.remove('d-none');
      return;
    }

    emptyState.classList.add('d-none');

    offers.forEach(function (offer) {
      const savings = offer.originalPrice - offer.offerPrice;
      const isSaved = savedIds.indexOf(offer.id) !== -1;

      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      const card = document.createElement('article');
      card.className = 'card card-hover offer-card';

      card.innerHTML =
        '<div class="offer-img-wrap">' +
          '<img src="' + offer.image + '" alt="' + offer.alt + '" class="offer-img" width="400" height="240">' +
          '<span class="offer-savings-tag">Save ' + formatPKR(savings) + '</span>' +
        '</div>' +
        '<div class="card-body d-flex flex-column p-4">' +
          '<div class="d-flex justify-content-between align-items-center gap-2 mb-2">' +
            '<span class="badge badge-pink rounded-pill">' + offer.category + '</span>' +
            '<small class="text-muted-bakery fw-semibold">' + offer.serves + '</small>' +
          '</div>' +
          '<h2 class="h5 mb-2">' + offer.title + '</h2>' +
          '<p class="small text-muted-bakery mb-2">' + offer.description + '</p>' +
          '<ul class="offer-items-list">' +
            offer.items.map(function (item) { return '<li>' + item + '</li>'; }).join('') +
          '</ul>' +
          '<div class="mt-auto pt-2 border-top">' +
            '<div class="d-flex align-items-baseline justify-content-between mb-2">' +
              '<div>' +
                '<span class="offer-price-new d-block">' + formatPKR(offer.offerPrice) + '</span>' +
                '<span class="offer-price-old">' + formatPKR(offer.originalPrice) + '</span>' +
              '</div>' +
              '<small class="text-muted-bakery">' + offer.validUntil + '</small>' +
            '</div>' +
            '<div class="d-flex align-items-center justify-content-between gap-2 mb-3">' +
              '<span class="offer-code-pill">Code: <strong>' + offer.promoCode + '</strong></span>' +
              '<button type="button" class="btn btn-outline-bakery btn-sm copy-code-btn">Copy</button>' +
            '</div>' +
            '<div class="d-grid gap-2 d-sm-flex">' +
              '<button type="button" class="btn btn-bakery flex-grow-1 add-offer-btn">Add to Basket</button>' +
              '<button type="button" class="btn ' + (isSaved ? 'btn-pink' : 'btn-outline-bakery') + ' save-offer-btn">' +
                (isSaved ? 'Saved' : 'Save Offer') +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      card.querySelector('.copy-code-btn').addEventListener('click', function (e) {
        copyPromoCode(offer.promoCode, e.currentTarget);
      });

      card.querySelector('.add-offer-btn').addEventListener('click', function () {
        addOfferToBasket(offer);
      });

      card.querySelector('.save-offer-btn').addEventListener('click', function () {
        toggleSavedOffer(offer.id);
      });

      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderSavedOffers() {
    const listEl = document.getElementById('savedOffersList');
    const emptyEl = document.getElementById('savedOffersEmpty');
    const clearBtn = document.getElementById('clearSavedOffersBtn');
    if (!listEl || !emptyEl || !clearBtn) return;

    const savedIds = getSavedOfferIds();
    const savedOffers = OFFERS_DATA.filter(function (offer) {
      return savedIds.indexOf(offer.id) !== -1;
    });

    listEl.innerHTML = '';

    if (savedOffers.length === 0) {
      emptyEl.classList.remove('d-none');
      clearBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('d-none');
    clearBtn.disabled = false;

    savedOffers.forEach(function (offer) {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      const box = document.createElement('div');
      box.className = 'saved-offer-chip p-3 h-100 d-flex flex-column justify-content-between';
      box.innerHTML =
        '<div>' +
          '<h3 class="h6 mb-1">' + offer.title + '</h3>' +
          '<p class="small text-muted-bakery mb-2">' + formatPKR(offer.offerPrice) + ' &bull; Code: <strong>' + offer.promoCode + '</strong></p>' +
        '</div>' +
        '<div class="d-flex gap-2">' +
          '<button type="button" class="btn btn-bakery btn-sm flex-grow-1 saved-add-btn">Add to Basket</button>' +
          '<button type="button" class="btn btn-outline-bakery btn-sm saved-remove-btn">Remove</button>' +
        '</div>';

      box.querySelector('.saved-add-btn').addEventListener('click', function () {
        addOfferToBasket(offer);
      });
      box.querySelector('.saved-remove-btn').addEventListener('click', function () {
        toggleSavedOffer(offer.id);
      });

      col.appendChild(box);
      listEl.appendChild(col);
    });
  }

  function resetFilters() {
    state = { category: 'All', search: '', sort: 'featured' };
    writeStorage(STORAGE_KEYS.FILTER_STATE, state);

    const searchInput = document.getElementById('offerSearch');
    const sortSelect = document.getElementById('offerSort');
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'featured';

    renderCategoryFilters();
    renderOffers();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const savedState = readStorage(STORAGE_KEYS.FILTER_STATE, null);
    if (savedState && typeof savedState === 'object') {
      state.category = OFFER_CATEGORIES.indexOf(savedState.category) !== -1 ? savedState.category : 'All';
      state.search = typeof savedState.search === 'string' ? savedState.search : '';
      state.sort = typeof savedState.sort === 'string' ? savedState.sort : 'featured';
    }

    const searchInput = document.getElementById('offerSearch');
    const sortSelect = document.getElementById('offerSort');
    const resetBtn = document.getElementById('resetOffersBtn');
    const emptyResetBtn = document.getElementById('emptyResetBtn');
    const copyFeaturedBtn = document.getElementById('copyFeaturedCodeBtn');
    const featuredStatus = document.getElementById('featuredCopyStatus');
    const clearSavedBtn = document.getElementById('clearSavedOffersBtn');

    if (searchInput) {
      searchInput.value = state.search;
      searchInput.addEventListener('input', function (e) {
        state.search = e.target.value;
        writeStorage(STORAGE_KEYS.FILTER_STATE, state);
        renderOffers();
      });
    }

    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener('change', function (e) {
        state.sort = e.target.value;
        writeStorage(STORAGE_KEYS.FILTER_STATE, state);
        renderOffers();
      });
    }

    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetFilters);

    if (copyFeaturedBtn) {
      copyFeaturedBtn.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('SWEET10').catch(function () {});
        }
        copyFeaturedBtn.textContent = 'Copied!';
        if (featuredStatus) {
          featuredStatus.textContent = 'SWEET10 copied! Use it at checkout on orders over PKR 3,000.';
        }
        setTimeout(function () {
          copyFeaturedBtn.textContent = 'Copy Code';
        }, 1800);
      });
    }

    if (clearSavedBtn) {
      clearSavedBtn.addEventListener('click', function () {
        writeStorage(STORAGE_KEYS.SAVED_OFFERS, []);
        renderOffers();
        renderSavedOffers();
        showStatusBanner('Cleared all saved offers.');
      });
    }

    updateNavCartBadge();
    renderCategoryFilters();
    renderOffers();
    renderSavedOffers();
  });
})();
