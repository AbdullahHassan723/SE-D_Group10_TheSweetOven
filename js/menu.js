(function () {
  "use strict";

  var MENU_STATE_KEY = "sweetOvenMenuState";
  var data = window.SweetOvenData;
  var shared = window.SweetOvenShared;

  if (!data || !shared) {
    return;
  }

  var state = loadMenuState();

  var searchInput = document.getElementById("menuSearchInput");
  var clearSearchBtn = document.getElementById("clearSearchBtn");
  var sortSelect = document.getElementById("menuSortSelect");
  var dietaryFiltersContainer = document.getElementById("dietaryFiltersContainer");
  var categoryFilterList = document.getElementById("categoryFilterList");
  var favoritesOnlyBtn = document.getElementById("favoritesOnlyBtn");
  var favoritesCountEl = document.getElementById("favoritesCount");
  var resetFiltersBtn = document.getElementById("resetFiltersBtn");
  var resultsSummary = document.getElementById("resultsSummary");
  var menuGrid = document.getElementById("menuGrid");
  var menuEmptyState = document.getElementById("menuEmptyState");
  var emptyStateHint = document.getElementById("emptyStateHint");
  var emptyResetBtn = document.getElementById("emptyResetBtn");
  var menuFeedback = document.getElementById("menuFeedback");

  // Quick-View Details Modal Elements
  var modalEl = document.getElementById("menuDetailsModal");
  var closeModalBtn = document.getElementById("closeModalBtn");
  var modalItemImage = document.getElementById("modalItemImage");
  var modalItemCategory = document.getElementById("modalItemCategory");
  var modalItemTitle = document.getElementById("modalItemTitle");
  var modalItemPrice = document.getElementById("modalItemPrice");
  var modalRatingText = document.getElementById("modalRatingText");
  var modalItemDesc = document.getElementById("modalItemDesc");
  var modalTabPanel = document.getElementById("modalTabPanel");
  var modalQtyMinus = document.getElementById("modalQtyMinus");
  var modalQtyPlus = document.getElementById("modalQtyPlus");
  var modalQtyValue = document.getElementById("modalQtyValue");
  var modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
  var modalFullDetailsLink = document.getElementById("modalFullDetailsLink");

  var activeModalItem = null;
  var activeModalTab = "ingredients";
  var activeModalQty = 1;
  var lastFocusedEl = null;

  function formatRs(amount) {
    return data.formatRs ? data.formatRs(amount) : shared.formatPKR(amount);
  }

  function formatReviews(count) {
    return data.formatReviews ? data.formatReviews(count) : count + " reviews";
  }

  function loadMenuState() {
    var fallback = {
      category: "all",
      search: "",
      sort: "featured",
      dietary: [],
      favoritesOnly: false
    };
    try {
      var raw = localStorage.getItem(MENU_STATE_KEY);
      if (!raw) {
        return fallback;
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return fallback;
      }
      var catValid = data.CATEGORIES.some(function (cat) {
        return cat.id === parsed.category;
      });
      return {
        category: catValid ? parsed.category : "all",
        search: typeof parsed.search === "string" ? parsed.search : "",
        sort: typeof parsed.sort === "string" ? parsed.sort : "featured",
        dietary: Array.isArray(parsed.dietary) ? parsed.dietary.map(String) : [],
        favoritesOnly: Boolean(parsed.favoritesOnly)
      };
    } catch (err) {
      return fallback;
    }
  }

  function saveMenuState() {
    try {
      localStorage.setItem(MENU_STATE_KEY, JSON.stringify(state));
    } catch (err) {
      // Ignore storage quota errors cleanly
    }
  }

  function showFeedback(message, showCartLink, isError) {
    if (!menuFeedback) {
      return;
    }
    menuFeedback.innerHTML = "";
    menuFeedback.classList.remove("d-none", "is-error");
    if (isError) {
      menuFeedback.classList.add("is-error");
    }

    var textSpan = document.createElement("span");
    textSpan.className = "fw-semibold";
    textSpan.textContent = message;
    menuFeedback.appendChild(textSpan);

    if (showCartLink) {
      var link = document.createElement("a");
      link.href = "cart.html";
      link.className = "btn btn-sm btn-pink";
      link.textContent = "View Cart";
      menuFeedback.appendChild(link);
    }
  }

  function renderSortOptions() {
    sortSelect.innerHTML = "";
    for (var i = 0; i < data.SORT_OPTIONS.length; i += 1) {
      var optData = data.SORT_OPTIONS[i];
      var option = document.createElement("option");
      option.value = optData.id;
      option.textContent = optData.label;
      if (state.sort === optData.id) {
        option.selected = true;
      }
      sortSelect.appendChild(option);
    }
  }

  function renderDietaryFilters() {
    dietaryFiltersContainer.innerHTML = "";
    for (var i = 0; i < data.DIETARY_FILTERS.length; i += 1) {
      var filter = data.DIETARY_FILTERS[i];
      var inputId = "dietary-" + filter.id;

      var label = document.createElement("label");
      label.className = "dietary-chip";
      label.setAttribute("for", inputId);

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = inputId;
      checkbox.className = "form-check-input";
      checkbox.value = filter.id;
      checkbox.checked = state.dietary.indexOf(filter.id) !== -1;

      var span = document.createElement("span");
      span.textContent = filter.label;

      label.appendChild(checkbox);
      label.appendChild(span);
      dietaryFiltersContainer.appendChild(label);
    }
  }

  function renderCategoryPills() {
    categoryFilterList.innerHTML = "";
    for (var i = 0; i < data.CATEGORIES.length; i += 1) {
      var cat = data.CATEGORIES[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-pill" + (state.category === cat.id ? " is-active" : "");
      btn.textContent = cat.label;
      btn.setAttribute("data-category", cat.id);
      btn.setAttribute("aria-pressed", state.category === cat.id ? "true" : "false");
      categoryFilterList.appendChild(btn);
    }
  }

  function getFilteredAndSortedItems() {
    var query = state.search.trim().toLowerCase();
    var favorites = shared.getFavorites();

    var filtered = data.MENU_ITEMS.filter(function (item) {
      if (state.category !== "all" && item.category !== state.category) {
        return false;
      }
      if (state.favoritesOnly && favorites.indexOf(item.id) === -1) {
        return false;
      }
      for (var d = 0; d < state.dietary.length; d += 1) {
        if (item.dietary.indexOf(state.dietary[d]) === -1) {
          return false;
        }
      }
      if (query) {
        var haystack = [
          item.name,
          item.category,
          item.shortDescription,
          item.description,
          item.weight,
          item.ingredients.join(" ")
        ].join(" ").toLowerCase();
        if (haystack.indexOf(query) === -1) {
          return false;
        }
      }
      return true;
    });

    filtered.sort(function (a, b) {
      if (state.sort === "price-asc") {
        return a.price - b.price;
      }
      if (state.sort === "price-desc") {
        return b.price - a.price;
      }
      if (state.sort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (state.sort === "rating-desc") {
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      }
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return 0;
    });

    return filtered;
  }

  function hasActiveFilters() {
    return (
      state.category !== "all" ||
      state.search.trim() !== "" ||
      state.dietary.length > 0 ||
      state.favoritesOnly ||
      state.sort !== "featured"
    );
  }

  function updateToolbarUI(visibleCount) {
    var totalCount = data.MENU_ITEMS.length;
    var favCount = shared.getFavorites().length;

    searchInput.value = state.search;
    clearSearchBtn.classList.toggle("d-none", state.search.trim() === "");
    favoritesCountEl.textContent = String(favCount);
    favoritesOnlyBtn.classList.toggle("is-active", state.favoritesOnly);
    favoritesOnlyBtn.setAttribute("aria-pressed", state.favoritesOnly ? "true" : "false");
    resetFiltersBtn.classList.toggle("d-none", !hasActiveFilters());

    if (visibleCount === 0) {
      resultsSummary.textContent = "Showing 0 of " + totalCount + " handmade bakes";
    } else if (visibleCount === 1) {
      resultsSummary.textContent = "Showing 1 handmade bake";
    } else {
      resultsSummary.textContent = "Showing " + visibleCount + " of " + totalCount + " handmade bakes";
    }
  }

  function createMenuCard(item) {
    var col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    var article = document.createElement("article");
    article.className = "card bakery-card card-hover menu-card h-100";
    article.setAttribute("data-card-href", "item-details.html?id=" + encodeURIComponent(item.id));

    var media = document.createElement("div");
    media.className = "menu-card-media";

    var imgLink = document.createElement("a");
    imgLink.href = "item-details.html?id=" + encodeURIComponent(item.id);
    imgLink.setAttribute("aria-label", "View details for " + item.name);

    var img = document.createElement("img");
    img.src = item.image;
    img.alt = item.alt;
    img.className = "menu-card-img";
    img.width = 240;
    img.height = 180;
    imgLink.appendChild(img);
    media.appendChild(imgLink);

    if (item.badge) {
      var badge = document.createElement("span");
      badge.className = "menu-card-badge";
      badge.textContent = item.badge;
      media.appendChild(badge);
    }

    var favActive = shared.isFavorite(item.id);
    var favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "favorite-toggle-btn" + (favActive ? " is-favorite" : "");
    favBtn.setAttribute("data-action", "toggle-favorite");
    favBtn.setAttribute("data-id", item.id);
    favBtn.setAttribute("aria-pressed", favActive ? "true" : "false");
    favBtn.setAttribute("aria-label", (favActive ? "Remove " : "Save ") + item.name + " to favourites");
    favBtn.textContent = favActive ? "♥" : "♡";
    media.appendChild(favBtn);

    var body = document.createElement("div");
    body.className = "card-body d-flex flex-column p-3 p-md-4";

    var topMeta = document.createElement("div");
    topMeta.className = "d-flex justify-content-between align-items-center gap-2 mb-2";

    var categoryEl = document.createElement("span");
    categoryEl.className = "menu-card-category";
    categoryEl.textContent = item.category;

    var ratingEl = document.createElement("span");
    ratingEl.className = "menu-card-rating";
    ratingEl.textContent = "★ " + item.rating.toFixed(1) + " (" + formatReviews(item.reviewCount) + ")";

    topMeta.appendChild(categoryEl);
    topMeta.appendChild(ratingEl);

    var title = document.createElement("h2");
    title.className = "menu-card-title";
    var titleLink = document.createElement("a");
    titleLink.href = "item-details.html?id=" + encodeURIComponent(item.id);
    titleLink.textContent = item.name;
    title.appendChild(titleLink);

    var desc = document.createElement("p");
    desc.className = "text-muted-bakery small mb-2";
    desc.textContent = item.shortDescription;

    var metaInfo = document.createElement("p");
    metaInfo.className = "menu-card-meta mb-3";
    metaInfo.textContent = item.weight + " • " + item.prepTime;

    var footer = document.createElement("div");
    footer.className = "mt-auto pt-2 border-top d-flex flex-column gap-2";

    var priceRow = document.createElement("div");
    priceRow.className = "d-flex justify-content-between align-items-center";

    var priceEl = document.createElement("span");
    priceEl.className = "menu-card-price";
    priceEl.textContent = formatRs(item.price);

    var egglessTag = document.createElement("span");
    if (item.dietary.indexOf("eggless-option") !== -1) {
      egglessTag.className = "badge badge-pink rounded-pill";
      egglessTag.textContent = "Eggless Option";
    }

    priceRow.appendChild(priceEl);
    if (egglessTag.textContent) {
      priceRow.appendChild(egglessTag);
    }

    var actions = document.createElement("div");
    actions.className = "d-flex gap-2";

    var quickBtn = document.createElement("button");
    quickBtn.type = "button";
    quickBtn.className = "btn btn-outline-bakery btn-sm";
    quickBtn.setAttribute("data-action", "open-modal");
    quickBtn.setAttribute("data-id", item.id);
    quickBtn.textContent = "Quick View";

    var addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-pink btn-sm flex-grow-1";
    addBtn.setAttribute("data-action", "add-to-cart");
    addBtn.setAttribute("data-id", item.id);
    addBtn.textContent = "Add to Cart";

    actions.appendChild(quickBtn);
    actions.appendChild(addBtn);

    footer.appendChild(priceRow);
    footer.appendChild(actions);

    body.appendChild(topMeta);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(metaInfo);
    body.appendChild(footer);

    article.appendChild(media);
    article.appendChild(body);
    col.appendChild(article);

    return col;
  }

  function renderMenu() {
    var items = getFilteredAndSortedItems();
    menuGrid.innerHTML = "";
    updateToolbarUI(items.length);

    if (items.length === 0) {
      menuEmptyState.classList.remove("d-none");
      if (state.favoritesOnly && shared.getFavorites().length === 0) {
        emptyStateHint.textContent = "You have not saved any favourite bakes yet. Click the heart icon on any item to save it here.";
      } else if (state.search.trim()) {
        emptyStateHint.textContent = "No bakery items matched \"" + state.search.trim() + "\". Try another keyword or reset your filters.";
      } else {
        emptyStateHint.textContent = "No treats match this combination of category and dietary filters.";
      }
      return;
    }

    menuEmptyState.classList.add("d-none");
    for (var i = 0; i < items.length; i += 1) {
      menuGrid.appendChild(createMenuCard(items[i]));
    }
  }

  function resetAllFilters() {
    state = {
      category: "all",
      search: "",
      sort: "featured",
      dietary: [],
      favoritesOnly: false
    };
    saveMenuState();
    renderSortOptions();
    renderDietaryFilters();
    renderCategoryPills();
    renderMenu();
  }

  function renderModalTabContent() {
    if (!activeModalItem || !modalTabPanel) {
      return;
    }

    var tabBtns = modalEl.querySelectorAll("[data-modal-tab]");
    for (var t = 0; t < tabBtns.length; t += 1) {
      var isCurrent = tabBtns[t].getAttribute("data-modal-tab") === activeModalTab;
      tabBtns[t].classList.toggle("is-active", isCurrent);
      tabBtns[t].setAttribute("aria-selected", isCurrent ? "true" : "false");
    }

    modalTabPanel.innerHTML = "";

    if (activeModalTab === "ingredients") {
      var ingUl = document.createElement("ul");
      ingUl.className = "mb-0 ps-3";
      for (var i = 0; i < activeModalItem.ingredients.length; i += 1) {
        var li = document.createElement("li");
        li.textContent = activeModalItem.ingredients[i];
        ingUl.appendChild(li);
      }
      modalTabPanel.appendChild(ingUl);
      return;
    }

    if (activeModalTab === "allergens") {
      var pillsWrap = document.createElement("div");
      pillsWrap.className = "mb-2";
      for (var a = 0; a < activeModalItem.allergens.length; a += 1) {
        var pill = document.createElement("span");
        pill.className = "allergen-pill";
        pill.textContent = activeModalItem.allergens[a];
        pillsWrap.appendChild(pill);
      }
      var noteP = document.createElement("p");
      noteP.className = "small text-muted-bakery mb-0";
      noteP.textContent = activeModalItem.allergenNote || "Prepared in a home kitchen that handles dairy, wheat, eggs, and tree nuts.";
      modalTabPanel.appendChild(pillsWrap);
      modalTabPanel.appendChild(noteP);
      return;
    }

    var bakerP = document.createElement("p");
    bakerP.className = "mb-2";
    bakerP.textContent = activeModalItem.bakerNote;
    var storageP = document.createElement("p");
    storageP.className = "small text-muted-bakery mb-0";
    storageP.textContent = "Storage: " + activeModalItem.storage;
    modalTabPanel.appendChild(bakerP);
    modalTabPanel.appendChild(storageP);
  }

  function updateModalQtyUI() {
    modalQtyValue.textContent = String(activeModalQty);
    modalQtyMinus.disabled = activeModalQty <= 1;
    modalQtyPlus.disabled = activeModalQty >= shared.MAX_ITEM_QTY;
  }

  function openDetailsModal(item, triggerEl) {
    if (!modalEl || !item) {
      return;
    }
    lastFocusedEl = triggerEl || document.activeElement;
    activeModalItem = item;
    activeModalTab = "ingredients";
    activeModalQty = 1;

    modalItemImage.src = item.image;
    modalItemImage.alt = item.alt;
    modalItemCategory.textContent = item.category + " • " + item.weight;
    modalItemTitle.textContent = item.name;
    modalItemPrice.textContent = formatRs(item.price);
    modalRatingText.textContent = item.rating.toFixed(1) + " (" + formatReviews(item.reviewCount) + ")";
    modalItemDesc.textContent = item.description;
    modalFullDetailsLink.href = "item-details.html?id=" + encodeURIComponent(item.id);

    renderModalTabContent();
    updateModalQtyUI();

    modalEl.classList.remove("d-none");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModalBtn.focus();
  }

  function closeDetailsModal() {
    if (!modalEl || modalEl.classList.contains("d-none")) {
      return;
    }
    modalEl.classList.add("d-none");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  searchInput.addEventListener("input", function () {
    state.search = searchInput.value;
    saveMenuState();
    renderMenu();
  });

  clearSearchBtn.addEventListener("click", function () {
    state.search = "";
    saveMenuState();
    renderMenu();
    searchInput.focus();
  });

  sortSelect.addEventListener("change", function () {
    state.sort = sortSelect.value;
    saveMenuState();
    renderMenu();
  });

  dietaryFiltersContainer.addEventListener("change", function (event) {
    var target = event.target;
    if (!target || target.type !== "checkbox") {
      return;
    }
    var val = target.value;
    var idx = state.dietary.indexOf(val);
    if (target.checked && idx === -1) {
      state.dietary.push(val);
    } else if (!target.checked && idx !== -1) {
      state.dietary.splice(idx, 1);
    }
    saveMenuState();
    renderMenu();
  });

  categoryFilterList.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-category]");
    if (!btn) {
      return;
    }
    state.category = btn.getAttribute("data-category");
    saveMenuState();
    renderCategoryPills();
    renderMenu();
  });

  favoritesOnlyBtn.addEventListener("click", function () {
    state.favoritesOnly = !state.favoritesOnly;
    saveMenuState();
    renderMenu();
  });

  resetFiltersBtn.addEventListener("click", resetAllFilters);
  emptyResetBtn.addEventListener("click", resetAllFilters);

  menuGrid.addEventListener("click", function (event) {
    var actionBtn = event.target.closest("[data-action]");
    if (actionBtn) {
      var action = actionBtn.getAttribute("data-action");
      var itemId = actionBtn.getAttribute("data-id");
      var item = data.getItemById(itemId);
      if (!item) {
        return;
      }

      if (action === "toggle-favorite") {
        var saved = shared.toggleFavorite(item.id);
        showFeedback(
          saved ? "Saved " + item.name + " to your favourites." : "Removed " + item.name + " from your favourites.",
          false,
          false
        );
        renderMenu();
        return;
      }

      if (action === "open-modal") {
        openDetailsModal(item, actionBtn);
        return;
      }

      if (action === "add-to-cart") {
        var result = shared.addToCart({
          id: item.id,
          name: item.name,
          category: item.category,
          weight: item.weight,
          price: item.price,
          quantity: 1,
          image: item.image,
          alt: item.alt
        });
        showFeedback(result.message, result.ok, !result.ok);
        return;
      }
    }

    // Clicking the card itself opens the Item Details page
    if (event.target.closest("a") || event.target.closest("button")) {
      return;
    }
    var cardEl = event.target.closest("[data-card-href]");
    if (cardEl) {
      window.location.href = cardEl.getAttribute("data-card-href");
    }
  });

  // Modal Interactions
  if (modalEl) {
    closeModalBtn.addEventListener("click", closeDetailsModal);

    modalEl.addEventListener("click", function (event) {
      if (event.target === modalEl) {
        closeDetailsModal();
        return;
      }
      var tabBtn = event.target.closest("[data-modal-tab]");
      if (tabBtn) {
        activeModalTab = tabBtn.getAttribute("data-modal-tab");
        renderModalTabContent();
      }
    });

    modalQtyMinus.addEventListener("click", function () {
      if (activeModalQty > 1) {
        activeModalQty -= 1;
        updateModalQtyUI();
      }
    });

    modalQtyPlus.addEventListener("click", function () {
      if (activeModalQty < shared.MAX_ITEM_QTY) {
        activeModalQty += 1;
        updateModalQtyUI();
      }
    });

    modalAddToCartBtn.addEventListener("click", function () {
      if (!activeModalItem) {
        return;
      }
      var res = shared.addToCart({
        id: activeModalItem.id,
        name: activeModalItem.name,
        category: activeModalItem.category,
        weight: activeModalItem.weight,
        price: activeModalItem.price,
        quantity: activeModalQty,
        image: activeModalItem.image,
        alt: activeModalItem.alt
      });
      closeDetailsModal();
      showFeedback(res.message, res.ok, !res.ok);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modalEl.classList.contains("d-none")) {
        closeDetailsModal();
      }
    });
  }

  renderSortOptions();
  renderDietaryFilters();
  renderCategoryPills();
  renderMenu();
})();
