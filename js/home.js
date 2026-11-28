(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var CART_INIT_KEY = "sweetOvenCartInitialized";
  var HOME_PREFS_KEY = "sweetOvenHomePrefs";
  var NEWSLETTER_KEY = "sweetOvenNewsletter";
  var LAST_VISIT_KEY = "sweetOvenLastVisit";
  var MAX_ITEM_QTY = 20;
  var CAROUSEL_INTERVAL_MS = 5000;
  var CARDS_PER_SLIDE = 3;

  var featuredBakes = [
    {
      id: "cake-belgian-fudge",
      name: "Belgian Chocolate Fudge Cake",
      category: "Signature Cakes",
      weight: "1 lb (Serves 4-6)",
      price: 2850,
      badge: "Best Seller",
      description: "Three moist dark-cocoa sponge layers coated in silky Callebaut chocolate ganache.",
      homeImage: "images/chocolate-fudge-cake.svg",
      cartImage: "../images/chocolate-fudge-cake.svg",
      alt: "Belgian Chocolate Fudge Cake topped with chocolate ganache"
    },
    {
      id: "tub-lotus-tres-leches",
      name: "Lotus Biscoff Tres Leches",
      category: "Milk Cakes",
      weight: "500 g Family Tub",
      price: 1650,
      badge: "Most Ordered",
      description: "Vanilla sponge soaked in three-milk blend, crowned with whipped cream and warm Biscoff crumble.",
      homeImage: "images/lotus-tres-leches.svg",
      cartImage: "../images/lotus-tres-leches.svg",
      alt: "Lotus Biscoff Tres Leches milk cake tub with caramel biscuit crumble"
    },
    {
      id: "box-red-velvet-cupcakes",
      name: "Classic Red Velvet Cupcakes",
      category: "Cupcakes",
      weight: "Box of 6",
      price: 1800,
      badge: "Customer Pick",
      description: "Velvety cocoa-buttermilk cupcakes piped high with whipped cream-cheese frosting.",
      homeImage: "images/red-velvet-cupcakes.svg",
      cartImage: "../images/red-velvet-cupcakes.svg",
      alt: "Red velvet cupcakes swirled with cream cheese frosting"
    },
    {
      id: "cake-hazelnut-praline",
      name: "Hazelnut Praline Layer Cake",
      category: "Signature Cakes",
      weight: "1.5 lb (Serves 6-8)",
      price: 3200,
      badge: "Weekend Special",
      description: "Roasted hazelnut praline cream layered between tender cocoa and vanilla sponge.",
      homeImage: "images/hazelnut-praline-cake.svg",
      cartImage: "../images/hazelnut-praline-cake.svg",
      alt: "Hazelnut Praline Layer Cake topped with caramelized nuts"
    },
    {
      id: "box-caramel-brownies",
      name: "Salted Caramel Walnut Brownies",
      category: "Brownies & Bars",
      weight: "Box of 6",
      price: 1550,
      badge: "Tea-Time Pick",
      description: "Crinkly-top dark fudge brownies marbled with house salted caramel and roasted walnuts.",
      homeImage: "images/caramel-walnut-brownies.svg",
      cartImage: "../images/caramel-walnut-brownies.svg",
      alt: "Fudge brownies drizzled with salted caramel and toasted walnuts"
    },
    {
      id: "box-cinnamon-rolls",
      name: "Warm Cream-Cheese Cinnamon Rolls",
      category: "Breakfast Pastries",
      weight: "Box of 4",
      price: 1400,
      badge: "Morning Batch",
      description: "Soft brioche swirls layered with Ceylon cinnamon sugar and tangy vanilla cream-cheese glaze.",
      homeImage: "images/cinnamon-rolls.svg",
      cartImage: "../images/cinnamon-rolls.svg",
      alt: "Box of four glazed cinnamon rolls with vanilla cream-cheese icing"
    }
  ];

  var bakeryHighlights = [
    {
      title: "Baked daily",
      subtitle: "Fresh morning batches in F-8/3",
      image: "images/icon-cupcake.svg",
      alt: "Cupcake icon representing fresh daily baking"
    },
    {
      title: "Custom cakes",
      subtitle: "Personalised tiers & flavours",
      image: "images/icon-cake-slice.svg",
      alt: "Cake slice icon representing custom celebration cakes"
    },
    {
      title: "Home delivery",
      subtitle: "Chilled dispatch across twin cities",
      image: "images/icon-delivery-truck.svg",
      alt: "Delivery truck icon representing home delivery"
    }
  ];

  var weeklyBakeSchedule = [
    { dayIndex: 1, day: "Monday", focus: "Morning Brioche & Cinnamon Rolls", slot: "10:00 AM Batch", note: "Pre-order by Sunday 8 PM" },
    { dayIndex: 2, day: "Tuesday", focus: "Salted Caramel Walnut Brownie Boxes", slot: "2:00 PM Batch", note: "Ideal for office tea breaks" },
    { dayIndex: 3, day: "Wednesday", focus: "Lotus Biscoff Tres Leches Milk Tubs", slot: "2:00 PM & 6:00 PM", note: "Freshly chilled family tubs" },
    { dayIndex: 4, day: "Thursday", focus: "Hazelnut Praline & Almond Pastries", slot: "10:00 AM Batch", note: "Limited 24 boxes per morning" },
    { dayIndex: 5, day: "Friday", focus: "Signature Belgian Chocolate Fudge Cakes", slot: "All 3 Dispatch Slots", note: "Weekend dawat favourite" },
    { dayIndex: 6, day: "Saturday", focus: "Custom Celebration Cakes & Cupcakes", slot: "10:00 AM – 8:00 PM", note: "48-hour custom slot booking" },
    { dayIndex: 0, day: "Sunday", focus: "Family Brunch Boxes & Red Velvet", slot: "9:00 AM – 5:00 PM", note: "Free pickup from F-8/3 kitchen" }
  ];

  var customerHighlights = [
    {
      name: "Sana Farooq",
      area: "Sector F-7/2, Islamabad",
      rating: "5 / 5",
      quote: "Ordered the Belgian Fudge Cake and Lotus Tres Leches for our anniversary dinner. Both tasted genuinely homemade and arrived right on time."
    },
    {
      name: "Hamza Siddiqui",
      area: "Chaklala Scheme III, Rawalpindi",
      rating: "5 / 5",
      quote: "The cinnamon rolls stay pillowy soft even after delivery, and the chilled van kept our cupcakes intact in summer heat."
    },
    {
      name: "Mariam Tariq",
      area: "Sector E-11, Islamabad",
      rating: "5 / 5",
      quote: "Honest prices in PKR and the hazelnut praline cake reminds me of artisan bakeries abroad. Friday drop alerts never miss."
    }
  ];

  var state = loadHomePrefs();
  var memoryCart = [];

  function safeGet(key) {
    if (window.SweetOvenNav && typeof window.SweetOvenNav.safeGetStorage === "function") {
      return window.SweetOvenNav.safeGetStorage(key);
    }
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    if (window.SweetOvenNav && typeof window.SweetOvenNav.safeSetStorage === "function") {
      return window.SweetOvenNav.safeSetStorage(key, value);
    }
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function safeRemove(key) {
    if (window.SweetOvenNav && typeof window.SweetOvenNav.safeRemoveStorage === "function") {
      return window.SweetOvenNav.safeRemoveStorage(key);
    }
    try {
      if (window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function safeParseJSON(raw, fallback) {
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function loadHomePrefs() {
    var saved = safeParseJSON(safeGet(HOME_PREFS_KEY), null);
    return {
      category: saved && typeof saved.category === "string" ? saved.category : "All",
      search: "",
      sort: saved && typeof saved.sort === "string" ? saved.sort : "featured"
    };
  }

  function saveHomePrefs() {
    safeSet(HOME_PREFS_KEY, JSON.stringify({
      category: state.category,
      sort: state.sort
    }));
  }

  function formatPKR(amount) {
    return "PKR " + Number(amount).toLocaleString("en-PK");
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (typeof text === "string") {
      el.textContent = text;
    }
    return el;
  }

  function initRememberedVisit() {
    var banner = document.getElementById("visitGreetingBanner");
    if (!banner) {
      return;
    }

    var previousVisit = safeGet(LAST_VISIT_KEY);
    if (previousVisit && previousVisit.trim()) {
      banner.textContent = "Welcome back, last visited on " + previousVisit.trim();
    } else {
      banner.textContent = "Welcome to The Sweet Oven";
    }

    var todayFormatted = new Date().toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    safeSet(LAST_VISIT_KEY, todayFormatted);
  }

  function loadCart() {
    var raw = safeGet(CART_STORAGE_KEY);
    if (!raw) {
      return memoryCart.slice();
    }
    var parsed = safeParseJSON(raw, null);
    return Array.isArray(parsed) ? parsed : [];
  }

  function showCartToast(message) {
    var toast = document.getElementById("homeCartToast");
    if (!toast) {
      return;
    }
    toast.innerHTML = "";
    toast.appendChild(createEl("span", "", message + " "));
    var link = createEl("a", "text-white fw-bold ms-1", "Go to Cart");
    link.href = "pages/cart.html";
    toast.appendChild(link);
    toast.classList.remove("d-none");
  }

  function addItemToCart(item) {
    var cart = loadCart();
    var existing = cart.find(function (entry) {
      return entry && entry.id === item.id;
    });

    if (existing) {
      existing.quantity = Math.min(MAX_ITEM_QTY, (Number(existing.quantity) || 1) + 1);
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        category: item.category,
        weight: item.weight,
        price: item.price,
        quantity: 1,
        image: item.cartImage,
        alt: item.alt
      });
    }

    memoryCart = cart;
    var savedCart = safeSet(CART_STORAGE_KEY, JSON.stringify(cart));
    safeSet(CART_INIT_KEY, "true");

    if (window.SweetOvenNav && typeof window.SweetOvenNav.updateCartBadge === "function") {
      window.SweetOvenNav.updateCartBadge();
    }

    if (savedCart) {
      showCartToast(item.name + " added to your basket (" + formatPKR(item.price) + ").");
    } else {
      showCartToast(item.name + " added for this session (" + formatPKR(item.price) + "; browser storage unavailable).");
    }
  }

  function buildProductCard(item, colClass, buttonLabel) {
    var col = createEl("div", colClass);
    var card = createEl("article", "card bake-card card-hover");

    var media = createEl("div", "bake-card-media");
    media.appendChild(createEl("span", "bake-tag", item.badge));
    var img = document.createElement("img");
    img.src = item.homeImage;
    img.alt = item.alt;
    img.width = 210;
    img.height = 150;
    media.appendChild(img);

    var body = createEl("div", "card-body d-flex flex-column p-3 p-lg-4");
    body.appendChild(createEl("p", "bake-meta mb-1", item.category + " • " + item.weight));
    body.appendChild(createEl("h3", "h5 mb-2", item.name));
    body.appendChild(createEl("p", "text-muted-bakery small mb-3 flex-grow-1", item.description));

    var footer = createEl("div", "d-flex align-items-center justify-content-between gap-2 pt-2 border-top");
    footer.appendChild(createEl("span", "bake-price", formatPKR(item.price)));

    var addBtn = createEl("button", "btn btn-pink btn-sm px-3", buttonLabel);
    addBtn.type = "button";
    addBtn.setAttribute("aria-label", "Add " + item.name + " to cart");
    addBtn.addEventListener("click", function () {
      addItemToCart(item);
    });

    footer.appendChild(addBtn);
    body.appendChild(footer);

    card.appendChild(media);
    card.appendChild(body);
    col.appendChild(card);
    return col;
  }

  function initBestSellersCarousel() {
    var carousel = document.getElementById("bestSellersCarousel");
    var viewport = document.getElementById("carouselViewport");
    var track = document.getElementById("carouselTrack");
    var dotsContainer = document.getElementById("carouselDots");
    var prevBtn = document.getElementById("carouselPrevBtn");
    var nextBtn = document.getElementById("carouselNextBtn");
    var emptyState = document.getElementById("carouselEmptyState");
    var liveRegion = document.getElementById("carouselLiveRegion");
    var statusHint = document.getElementById("carouselStatusHint");

    if (!carousel || !track || !dotsContainer || !prevBtn || !nextBtn) {
      return;
    }

    if (!Array.isArray(featuredBakes) || featuredBakes.length === 0) {
      if (viewport) { viewport.classList.add("d-none"); }
      if (emptyState) { emptyState.classList.remove("d-none"); }
      dotsContainer.innerHTML = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      if (statusHint) {
        statusHint.textContent = "No best sellers available right now";
      }
      if (liveRegion) {
        liveRegion.textContent = "Best sellers carousel is currently empty.";
      }
      return;
    }

    if (viewport) { viewport.classList.remove("d-none"); }
    if (emptyState) { emptyState.classList.add("d-none"); }

    var slides = [];
    for (var i = 0; i < featuredBakes.length; i += CARDS_PER_SLIDE) {
      slides.push(featuredBakes.slice(i, i + CARDS_PER_SLIDE));
    }

    prevBtn.disabled = slides.length <= 1;
    nextBtn.disabled = slides.length <= 1;

    var currentIndex = 0;
    var timerId = null;
    var isHovered = false;
    var isFocused = false;
    var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var prefersReducedMotion = Boolean(motionQuery && motionQuery.matches);

    track.innerHTML = "";
    dotsContainer.innerHTML = "";

    slides.forEach(function (group, slideIdx) {
      var slide = createEl("div", "carousel-slide");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", "Best Sellers slide " + (slideIdx + 1) + " of " + slides.length);

      var row = createEl("div", "row g-3 g-lg-4");
      group.forEach(function (item) {
        row.appendChild(buildProductCard(item, "col-md-4", "Add"));
      });

      slide.appendChild(row);
      track.appendChild(slide);

      var dot = createEl("button", "carousel-dot" + (slideIdx === 0 ? " is-active" : ""));
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to best sellers slide " + (slideIdx + 1));
      dot.setAttribute("aria-current", slideIdx === 0 ? "true" : "false");
      dot.addEventListener("click", function () {
        goToSlide(slideIdx, true);
      });
      dotsContainer.appendChild(dot);
    });

    function updateStatusHint() {
      if (!statusHint) {
        return;
      }
      if (prefersReducedMotion) {
        statusHint.textContent = "Reduced motion active • Manual slide controls";
      } else if (isHovered || isFocused) {
        statusHint.textContent = "Auto-advance paused while reading or focused";
      } else {
        statusHint.textContent = "Auto-advances every 5 seconds • Pauses on hover or focus";
      }
    }

    function goToSlide(targetIndex, shouldAnnounce) {
      var total = slides.length;
      currentIndex = ((targetIndex % total) + total) % total;
      track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";

      var dots = dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach(function (dotBtn, dotIdx) {
        var active = dotIdx === currentIndex;
        dotBtn.classList.toggle("is-active", active);
        dotBtn.setAttribute("aria-current", active ? "true" : "false");
      });

      if (liveRegion && shouldAnnounce) {
        liveRegion.textContent = "Showing best sellers slide " + (currentIndex + 1) + " of " + total;
      }
    }

    function stopAutoAdvance() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function startAutoAdvance() {
      stopAutoAdvance();
      if (prefersReducedMotion || isHovered || isFocused || slides.length <= 1) {
        updateStatusHint();
        return;
      }
      timerId = setInterval(function () {
        goToSlide(currentIndex + 1, false);
      }, CAROUSEL_INTERVAL_MS);
      updateStatusHint();
    }

    prevBtn.addEventListener("click", function () {
      goToSlide(currentIndex - 1, true);
    });

    nextBtn.addEventListener("click", function () {
      goToSlide(currentIndex + 1, true);
    });

    carousel.addEventListener("mouseenter", function () {
      isHovered = true;
      stopAutoAdvance();
      updateStatusHint();
    });

    carousel.addEventListener("mouseleave", function () {
      isHovered = false;
      startAutoAdvance();
    });

    carousel.addEventListener("focusin", function () {
      isFocused = true;
      stopAutoAdvance();
      updateStatusHint();
    });

    carousel.addEventListener("focusout", function (event) {
      if (!event.relatedTarget || !carousel.contains(event.relatedTarget)) {
        isFocused = false;
        startAutoAdvance();
      }
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(currentIndex + 1, true);
      }
    });

    if (motionQuery && typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", function (event) {
        prefersReducedMotion = event.matches;
        if (prefersReducedMotion) {
          stopAutoAdvance();
        } else {
          startAutoAdvance();
        }
        updateStatusHint();
      });
    }

    goToSlide(0, false);
    startAutoAdvance();
  }

  function getCategories() {
    var seen = ["All"];
    featuredBakes.forEach(function (item) {
      if (seen.indexOf(item.category) === -1) {
        seen.push(item.category);
      }
    });
    return seen;
  }

  function renderCategoryFilters() {
    var bar = document.getElementById("categoryFilterBar");
    if (!bar) {
      return;
    }
    bar.innerHTML = "";

    var categories = getCategories();
    if (categories.indexOf(state.category) === -1) {
      state.category = "All";
    }

    categories.forEach(function (category) {
      var btn = createEl(
        "button",
        "filter-pill" + (state.category === category ? " is-active" : ""),
        category
      );
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(state.category === category));
      btn.addEventListener("click", function () {
        state.category = category;
        saveHomePrefs();
        renderCategoryFilters();
        renderFeaturedBakes();
      });
      bar.appendChild(btn);
    });
  }

  function getFilteredAndSortedBakes() {
    var query = state.search.trim().toLowerCase();

    var filtered = featuredBakes.filter(function (item) {
      var matchesCategory = state.category === "All" || item.category === state.category;
      var matchesSearch = !query ||
        item.name.toLowerCase().indexOf(query) !== -1 ||
        item.category.toLowerCase().indexOf(query) !== -1 ||
        item.description.toLowerCase().indexOf(query) !== -1;
      return matchesCategory && matchesSearch;
    });

    if (state.sort === "price-asc") {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sort === "price-desc") {
      filtered.sort(function (a, b) { return b.price - a.price; });
    }

    return filtered;
  }

  function renderFeaturedBakes() {
    var grid = document.getElementById("featuredBakesGrid");
    var emptyBox = document.getElementById("featuredEmptyState");
    var emptyText = document.getElementById("featuredEmptyText");

    if (!grid || !emptyBox) {
      return;
    }

    grid.innerHTML = "";
    var items = getFilteredAndSortedBakes();

    if (items.length === 0) {
      emptyBox.classList.remove("d-none");
      if (emptyText) {
        emptyText.textContent = state.search.trim()
          ? 'No treats matched "' + state.search.trim() + '" in ' + state.category + "."
          : "No treats available under this category right now.";
      }
      return;
    }

    emptyBox.classList.add("d-none");

    items.forEach(function (item) {
      grid.appendChild(buildProductCard(item, "col-md-6 col-lg-4", "Add"));
    });
  }

  function renderHighlights() {
    var container = document.getElementById("bakeryHighlightsGrid");
    if (!container) {
      return;
    }
    container.innerHTML = "";

    bakeryHighlights.forEach(function (item) {
      var row = createEl("div", "highlight-item");

      var circle = createEl("div", "highlight-icon-circle");
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt;
      img.width = 54;
      img.height = 54;
      circle.appendChild(img);

      var textWrap = createEl("div", "");
      textWrap.appendChild(createEl("p", "highlight-caption", item.title));
      textWrap.appendChild(createEl("p", "highlight-subtext", item.subtitle));

      row.appendChild(circle);
      row.appendChild(textWrap);
      container.appendChild(row);
    });
  }

  function renderWeeklySchedule() {
    var grid = document.getElementById("weeklyScheduleGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    var todayDay = new Date().getDay();

    weeklyBakeSchedule.forEach(function (entry) {
      var isToday = entry.dayIndex === todayDay;
      var col = createEl("div", "col-sm-6 col-lg-4");
      var card = createEl("article", "card schedule-card" + (isToday ? " is-today" : ""));

      var topRow = createEl("div", "d-flex justify-content-between align-items-center mb-2");
      topRow.appendChild(createEl("h3", "h5 mb-0", entry.day));

      if (isToday) {
        topRow.appendChild(createEl("span", "today-pill", "Today's Oven"));
      }

      card.appendChild(topRow);
      card.appendChild(createEl("p", "fw-bold mb-1", entry.focus));
      card.appendChild(createEl("p", "small text-muted-bakery mb-1", "Dispatch: " + entry.slot));
      card.appendChild(createEl("p", "small mb-0", entry.note));
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderCustomerHighlights() {
    var grid = document.getElementById("customerQuotesGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    customerHighlights.forEach(function (review) {
      var col = createEl("div", "col-md-4");
      var card = createEl("article", "card quote-card");
      card.appendChild(createEl("p", "quote-stars small mb-2", "Rating: " + review.rating));
      card.appendChild(createEl("p", "mb-3", '"' + review.quote + '"'));
      card.appendChild(createEl("p", "fw-bold mb-0", review.name));
      card.appendChild(createEl("p", "small text-muted-bakery mb-0", review.area));
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function initSearchAndSort() {
    var searchInput = document.getElementById("homeSearchInput");
    var sortSelect = document.getElementById("homeSortSelect");
    var resetBtn = document.getElementById("resetFeaturedBtn");

    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        saveHomePrefs();
        renderFeaturedBakes();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value;
        renderFeaturedBakes();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.category = "All";
        state.search = "";
        state.sort = "featured";
        if (searchInput) {
          searchInput.value = "";
        }
        if (sortSelect) {
          sortSelect.value = "featured";
        }
        saveHomePrefs();
        renderCategoryFilters();
        renderFeaturedBakes();
      });
    }
  }

  function initNewsletter() {
    var form = document.getElementById("newsletterForm");
    var emailInput = document.getElementById("newsletterEmail");
    var errorEl = document.getElementById("newsletterError");
    var successEl = document.getElementById("newsletterSuccess");
    var successText = document.getElementById("newsletterSuccessText");
    var unsubBtn = document.getElementById("unsubscribeNewsletterBtn");

    if (!form || !emailInput) {
      return;
    }

    function showSavedSubscription(email) {
      if (successEl && successText) {
        successText.textContent = "Subscribed as " + email + " for Friday menu drops.";
        successEl.classList.remove("d-none");
      }
      if (errorEl) {
        errorEl.classList.add("d-none");
      }
    }

    var savedEmail = safeGet(NEWSLETTER_KEY);
    if (savedEmail) {
      emailInput.value = savedEmail;
      showSavedSubscription(savedEmail);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = emailInput.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!value) {
        errorEl.textContent = "Please enter your email address first.";
        errorEl.classList.remove("d-none");
        successEl.classList.add("d-none");
        emailInput.focus();
        return;
      }

      if (!emailPattern.test(value)) {
        errorEl.textContent = "Please enter a valid email address (for example, ayesha@example.com).";
        errorEl.classList.remove("d-none");
        successEl.classList.add("d-none");
        emailInput.focus();
        return;
      }

      safeSet(NEWSLETTER_KEY, value);
      showSavedSubscription(value);
    });

    if (unsubBtn) {
      unsubBtn.addEventListener("click", function () {
        safeRemove(NEWSLETTER_KEY);
        emailInput.value = "";
        successEl.classList.add("d-none");
        errorEl.classList.add("d-none");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initRememberedVisit();
    initBestSellersCarousel();
    renderCategoryFilters();
    renderFeaturedBakes();
    renderHighlights();
    renderWeeklySchedule();
    renderCustomerHighlights();
    initSearchAndSort();
    initNewsletter();
  });
})();
