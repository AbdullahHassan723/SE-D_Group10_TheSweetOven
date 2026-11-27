(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var CART_INIT_KEY = "sweetOvenCartInitialized";
  var PROMO_STORAGE_KEY = "sweetOvenPromo";
  var MAX_ITEM_QTY = 20;

  var defaultCartItems = [
    {
      id: "cake-belgian-fudge",
      name: "Belgian Chocolate Fudge Cake",
      category: "Signature Cakes",
      weight: "1 lb (Serves 4-6)",
      price: 2850,
      quantity: 1,
      image: "../images/chocolate-fudge-cake.svg",
      alt: "Belgian Chocolate Fudge Cake topped with chocolate ganache"
    },
    {
      id: "tub-lotus-tres-leches",
      name: "Lotus Biscoff Tres Leches Tub",
      category: "Milk Cakes",
      weight: "500 g Family Tub",
      price: 1650,
      quantity: 2,
      image: "../images/lotus-tres-leches.svg",
      alt: "Lotus Biscoff Tres Leches milk cake tub with caramel biscuit crumble"
    },
    {
      id: "box-cinnamon-rolls",
      name: "Warm Cream-Cheese Cinnamon Rolls",
      category: "Breakfast Pastries",
      weight: "Box of 4",
      price: 1400,
      quantity: 1,
      image: "../images/cinnamon-rolls.svg",
      alt: "Box of four glazed cinnamon rolls with vanilla cream-cheese icing"
    }
  ];

  var bakeryCatalog = [
    {
      id: "cake-belgian-fudge",
      name: "Belgian Chocolate Fudge Cake",
      category: "Signature Cakes",
      weight: "1 lb (Serves 4-6)",
      price: 2850,
      image: "../images/chocolate-fudge-cake.svg",
      alt: "Belgian Chocolate Fudge Cake topped with chocolate ganache"
    },
    {
      id: "tub-lotus-tres-leches",
      name: "Lotus Biscoff Tres Leches Tub",
      category: "Milk Cakes",
      weight: "500 g Family Tub",
      price: 1650,
      image: "../images/lotus-tres-leches.svg",
      alt: "Lotus Biscoff Tres Leches milk cake tub with caramel biscuit crumble"
    },
    {
      id: "box-cinnamon-rolls",
      name: "Warm Cream-Cheese Cinnamon Rolls",
      category: "Breakfast Pastries",
      weight: "Box of 4",
      price: 1400,
      image: "../images/cinnamon-rolls.svg",
      alt: "Box of four glazed cinnamon rolls with vanilla cream-cheese icing"
    },
    {
      id: "box-red-velvet-cupcakes",
      name: "Classic Red Velvet Cupcakes",
      category: "Cupcakes",
      weight: "Box of 6",
      price: 1800,
      image: "../images/red-velvet-cupcakes.svg",
      alt: "Red velvet cupcakes swirled with cream cheese frosting"
    },
    {
      id: "box-caramel-brownies",
      name: "Salted Caramel Walnut Brownies",
      category: "Brownies & Bars",
      weight: "Box of 6",
      price: 1550,
      image: "../images/caramel-walnut-brownies.svg",
      alt: "Fudge brownies drizzled with salted caramel and toasted walnuts"
    },
    {
      id: "pack-almond-croissants",
      name: "Butter Almond Croissants",
      category: "Viennoiserie",
      weight: "Pack of 2",
      price: 950,
      image: "../images/almond-croissants.svg",
      alt: "Flaky golden almond croissants dusted with toasted almonds"
    }
  ];

  var promoRules = [
    {
      code: "SWEET10",
      rate: 0.10,
      description: "10% bakery welcome discount applied."
    }
  ];

  var cartItems = loadCart();
  var activePromoCode = loadPromo();

  var navToggle = document.getElementById("navToggle");
  var primaryMenu = document.getElementById("primaryMenu");
  var navCartCount = document.getElementById("navCartCount");
  var cartItemsContainer = document.getElementById("cartItemsContainer");
  var emptyCartState = document.getElementById("emptyCartState");
  var cartFeedback = document.getElementById("cartFeedback");
  var clearCartBtn = document.getElementById("clearCartBtn");
  var restoreSampleBtn = document.getElementById("restoreSampleBtn");

  var promoForm = document.getElementById("promoForm");
  var promoInput = document.getElementById("promoInput");
  var promoFeedback = document.getElementById("promoFeedback");
  var removePromoBtn = document.getElementById("removePromoBtn");

  var summaryItemCount = document.getElementById("summaryItemCount");
  var summarySubtotal = document.getElementById("summarySubtotal");
  var discountRow = document.getElementById("discountRow");
  var appliedCodeLabel = document.getElementById("appliedCodeLabel");
  var summaryDiscount = document.getElementById("summaryDiscount");
  var summaryTotal = document.getElementById("summaryTotal");
  var proceedCheckoutBtn = document.getElementById("proceedCheckoutBtn");

  var quickAddGrid = document.getElementById("quickAddGrid");
  var bakerySearchInput = document.getElementById("bakerySearchInput");
  var noSearchResults = document.getElementById("noSearchResults");
  var searchQueryText = document.getElementById("searchQueryText");
  var clearSearchBtn = document.getElementById("clearSearchBtn");

  function formatPKR(amount) {
    return "PKR " + Math.round(amount).toLocaleString("en-PK");
  }

  function sanitizeCartItem(item) {
    if (!item || typeof item !== "object" || !item.id || !item.name) {
      return null;
    }
    var price = Number(item.price);
    var qty = parseInt(item.quantity, 10);
    if (!Number.isFinite(price) || price <= 0) {
      return null;
    }
    if (!Number.isInteger(qty) || qty < 1) {
      qty = 1;
    } else if (qty > MAX_ITEM_QTY) {
      qty = MAX_ITEM_QTY;
    }
    return {
      id: String(item.id),
      name: String(item.name),
      category: String(item.category || "Bakery Treat"),
      weight: String(item.weight || "Standard Pack"),
      price: price,
      quantity: qty,
      image: String(item.image || "../images/chocolate-fudge-cake.svg"),
      alt: String(item.alt || item.name)
    };
  }

  function loadCart() {
    try {
      var initialized = localStorage.getItem(CART_INIT_KEY);
      var raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!initialized && raw === null) {
        var initial = defaultCartItems.map(sanitizeCartItem).filter(Boolean);
        localStorage.setItem(CART_INIT_KEY, "true");
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map(sanitizeCartItem).filter(Boolean);
    } catch (err) {
      return defaultCartItems.slice();
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_INIT_KEY, "true");
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      showFeedback("Unable to save basket in browser storage.", true);
    }
  }

  function loadPromo() {
    try {
      var saved = localStorage.getItem(PROMO_STORAGE_KEY) || "";
      var matched = findPromo(saved);
      return matched ? matched.code : "";
    } catch (err) {
      return "";
    }
  }

  function savePromo(code) {
    try {
      if (code) {
        localStorage.setItem(PROMO_STORAGE_KEY, code);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (err) {
      // Ignore storage write errors gracefully
    }
  }

  function findPromo(code) {
    var normalized = String(code || "").trim().toUpperCase();
    for (var i = 0; i < promoRules.length; i += 1) {
      if (promoRules[i].code === normalized) {
        return promoRules[i];
      }
    }
    return null;
  }

  function showFeedback(message, isError) {
    if (!message) {
      cartFeedback.classList.add("d-none");
      cartFeedback.textContent = "";
      return;
    }
    cartFeedback.textContent = message;
    cartFeedback.classList.remove("d-none", "is-error");
    if (isError) {
      cartFeedback.classList.add("is-error");
    }
  }

  function calculateTotals() {
    var itemCount = 0;
    var subtotal = 0;
    for (var i = 0; i < cartItems.length; i += 1) {
      itemCount += cartItems[i].quantity;
      subtotal += cartItems[i].price * cartItems[i].quantity;
    }
    var promo = activePromoCode ? findPromo(activePromoCode) : null;
    var discount = promo && subtotal > 0 ? Math.round(subtotal * promo.rate) : 0;
    var total = Math.max(0, subtotal - discount);

    return {
      itemCount: itemCount,
      subtotal: subtotal,
      promo: promo,
      discount: discount,
      total: total
    };
  }

  function updateSummary() {
    var totals = calculateTotals();
    navCartCount.textContent = String(totals.itemCount);
    summaryItemCount.textContent = String(totals.itemCount);
    summarySubtotal.textContent = formatPKR(totals.subtotal);
    summaryTotal.textContent = formatPKR(totals.total);

    if (totals.promo && totals.subtotal > 0) {
      discountRow.classList.remove("d-none");
      appliedCodeLabel.textContent = totals.promo.code;
      summaryDiscount.textContent = "- " + formatPKR(totals.discount);
      promoInput.value = totals.promo.code;
      promoFeedback.textContent = totals.promo.description;
      promoFeedback.className = "form-text mt-1 text-success fw-semibold";
      removePromoBtn.classList.remove("d-none");
    } else {
      discountRow.classList.add("d-none");
      removePromoBtn.classList.add("d-none");
      if (!activePromoCode) {
        promoFeedback.innerHTML = "Use <strong>SWEET10</strong> to save 10% on your basket.";
        promoFeedback.className = "form-text mt-1";
      }
    }

    var isEmpty = cartItems.length === 0;
    clearCartBtn.disabled = isEmpty;
    if (isEmpty) {
      proceedCheckoutBtn.classList.add("disabled");
      proceedCheckoutBtn.setAttribute("aria-disabled", "true");
      proceedCheckoutBtn.setAttribute("tabindex", "-1");
    } else {
      proceedCheckoutBtn.classList.remove("disabled");
      proceedCheckoutBtn.removeAttribute("aria-disabled");
      proceedCheckoutBtn.removeAttribute("tabindex");
    }
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      emptyCartState.classList.remove("d-none");
      updateSummary();
      return;
    }

    emptyCartState.classList.add("d-none");

    for (var i = 0; i < cartItems.length; i += 1) {
      var item = cartItems[i];
      var card = document.createElement("article");
      card.className = "cart-item-card";
      card.setAttribute("data-item-id", item.id);

      var img = document.createElement("img");
      img.className = "cart-item-img";
      img.src = item.image;
      img.alt = item.alt;
      img.width = 112;
      img.height = 90;

      var details = document.createElement("div");

      var badge = document.createElement("span");
      badge.className = "cart-item-category";
      badge.textContent = item.category;

      var title = document.createElement("h2");
      title.className = "cart-item-title";
      title.textContent = item.name;

      var meta = document.createElement("p");
      meta.className = "cart-item-meta";
      meta.textContent = item.weight + " • " + formatPKR(item.price) + " each";

      var qtyWrapper = document.createElement("div");
      qtyWrapper.className = "d-flex align-items-center gap-2 flex-wrap";

      var qtyLabel = document.createElement("label");
      var inputId = "qty-" + item.id;
      qtyLabel.setAttribute("for", inputId);
      qtyLabel.className = "visually-hidden";
      qtyLabel.textContent = "Quantity for " + item.name;

      var qtyControls = document.createElement("div");
      qtyControls.className = "qty-controls";

      var decBtn = document.createElement("button");
      decBtn.type = "button";
      decBtn.className = "qty-btn";
      decBtn.textContent = "-";
      decBtn.disabled = item.quantity <= 1;
      decBtn.setAttribute("aria-label", "Decrease quantity of " + item.name);
      decBtn.setAttribute("data-action", "decrease");
      decBtn.setAttribute("data-id", item.id);

      var qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.id = inputId;
      qtyInput.className = "qty-input";
      qtyInput.min = "1";
      qtyInput.max = String(MAX_ITEM_QTY);
      qtyInput.step = "1";
      qtyInput.value = String(item.quantity);
      qtyInput.setAttribute("data-action", "input");
      qtyInput.setAttribute("data-id", item.id);

      var incBtn = document.createElement("button");
      incBtn.type = "button";
      incBtn.className = "qty-btn";
      incBtn.textContent = "+";
      incBtn.disabled = item.quantity >= MAX_ITEM_QTY;
      incBtn.setAttribute("aria-label", "Increase quantity of " + item.name);
      incBtn.setAttribute("data-action", "increase");
      incBtn.setAttribute("data-id", item.id);

      qtyControls.appendChild(decBtn);
      qtyControls.appendChild(qtyInput);
      qtyControls.appendChild(incBtn);
      qtyWrapper.appendChild(qtyLabel);
      qtyWrapper.appendChild(qtyControls);

      details.appendChild(badge);
      details.appendChild(title);
      details.appendChild(meta);
      details.appendChild(qtyWrapper);

      var actions = document.createElement("div");
      actions.className = "cart-item-actions";

      var lineTotal = document.createElement("div");
      lineTotal.className = "line-total";
      lineTotal.textContent = formatPKR(item.price * item.quantity);

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.setAttribute("data-action", "remove");
      removeBtn.setAttribute("data-id", item.id);
      removeBtn.setAttribute("aria-label", "Remove " + item.name + " from basket");

      actions.appendChild(lineTotal);
      actions.appendChild(removeBtn);

      card.appendChild(img);
      card.appendChild(details);
      card.appendChild(actions);
      cartItemsContainer.appendChild(card);
    }

    updateSummary();
  }

  function findCartIndex(itemId) {
    for (var i = 0; i < cartItems.length; i += 1) {
      if (cartItems[i].id === itemId) {
        return i;
      }
    }
    return -1;
  }

  function updateQuantity(itemId, rawValue) {
    var index = findCartIndex(itemId);
    if (index === -1) {
      return;
    }
    var trimmed = String(rawValue).trim();
    if (!/^\d+$/.test(trimmed)) {
      showFeedback("Invalid quantity entered for " + cartItems[index].name + ". Please enter a whole number from 1 to " + MAX_ITEM_QTY + ".", true);
      renderCart();
      return;
    }
    var parsed = parseInt(trimmed, 10);
    if (parsed < 1) {
      showFeedback("Minimum quantity is 1. Use Remove if you want to take " + cartItems[index].name + " out of your basket.", true);
      renderCart();
      return;
    }
    if (parsed > MAX_ITEM_QTY) {
      cartItems[index].quantity = MAX_ITEM_QTY;
      saveCart();
      showFeedback("Home bakery orders are capped at " + MAX_ITEM_QTY + " units per item.", true);
      renderCart();
      return;
    }
    cartItems[index].quantity = parsed;
    saveCart();
    showFeedback("");
    renderCart();
  }

  function removeItem(itemId) {
    var index = findCartIndex(itemId);
    if (index === -1) {
      return;
    }
    var removedName = cartItems[index].name;
    cartItems.splice(index, 1);
    saveCart();
    showFeedback("Removed " + removedName + " from your basket.", false);
    renderCart();
  }

  function addCatalogItem(itemId) {
    var product = null;
    for (var i = 0; i < bakeryCatalog.length; i += 1) {
      if (bakeryCatalog[i].id === itemId) {
        product = bakeryCatalog[i];
        break;
      }
    }
    if (!product) {
      return;
    }
    var existingIndex = findCartIndex(product.id);
    if (existingIndex !== -1) {
      if (cartItems[existingIndex].quantity >= MAX_ITEM_QTY) {
        showFeedback("Maximum quantity (" + MAX_ITEM_QTY + ") reached for " + product.name + ".", true);
        return;
      }
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push(sanitizeCartItem({
        id: product.id,
        name: product.name,
        category: product.category,
        weight: product.weight,
        price: product.price,
        quantity: 1,
        image: product.image,
        alt: product.alt
      }));
    }
    saveCart();
    showFeedback("Added " + product.name + " to your basket.", false);
    renderCart();
  }

  function renderQuickAdd(query) {
    var term = String(query || "").trim().toLowerCase();
    var filtered = bakeryCatalog.filter(function (item) {
      if (!term) {
        return true;
      }
      return (
        item.name.toLowerCase().indexOf(term) !== -1 ||
        item.category.toLowerCase().indexOf(term) !== -1 ||
        item.weight.toLowerCase().indexOf(term) !== -1
      );
    });

    quickAddGrid.innerHTML = "";
    if (filtered.length === 0) {
      searchQueryText.textContent = query.trim();
      noSearchResults.classList.remove("d-none");
      return;
    }

    noSearchResults.classList.add("d-none");
    for (var i = 0; i < filtered.length; i += 1) {
      var item = filtered[i];
      var col = document.createElement("div");
      col.className = "col-sm-6 col-lg-4";

      var card = document.createElement("article");
      card.className = "quick-add-card";

      var top = document.createElement("div");
      var img = document.createElement("img");
      img.className = "quick-add-img mb-2";
      img.src = item.image;
      img.alt = item.alt;
      img.width = 240;
      img.height = 140;

      var cat = document.createElement("span");
      cat.className = "cart-item-category";
      cat.textContent = item.category;

      var name = document.createElement("h3");
      name.className = "h6 fw-bold mb-1";
      name.textContent = item.name;

      var weight = document.createElement("p");
      weight.className = "small text-muted-brown mb-2";
      weight.textContent = item.weight;

      top.appendChild(img);
      top.appendChild(cat);
      top.appendChild(name);
      top.appendChild(weight);

      var bottom = document.createElement("div");
      bottom.className = "d-flex justify-content-between align-items-center pt-2 border-top";

      var price = document.createElement("span");
      price.className = "fw-bold";
      price.textContent = formatPKR(item.price);

      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn-caramel btn-sm";
      addBtn.textContent = "+ Add to Basket";
      addBtn.setAttribute("data-add-id", item.id);

      bottom.appendChild(price);
      bottom.appendChild(addBtn);

      card.appendChild(top);
      card.appendChild(bottom);
      col.appendChild(card);
      quickAddGrid.appendChild(col);
    }
  }

  // Event Listeners
  navToggle.addEventListener("click", function () {
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryMenu.classList.toggle("is-open", !expanded);
  });

  cartItemsContainer.addEventListener("click", function (event) {
    var target = event.target.closest("button[data-action]");
    if (!target) {
      return;
    }
    var action = target.getAttribute("data-action");
    var itemId = target.getAttribute("data-id");
    var index = findCartIndex(itemId);
    if (index === -1) {
      return;
    }
    if (action === "increase") {
      updateQuantity(itemId, cartItems[index].quantity + 1);
    } else if (action === "decrease") {
      updateQuantity(itemId, cartItems[index].quantity - 1);
    } else if (action === "remove") {
      removeItem(itemId);
    }
  });

  cartItemsContainer.addEventListener("change", function (event) {
    var input = event.target.closest("input[data-action='input']");
    if (!input) {
      return;
    }
    updateQuantity(input.getAttribute("data-id"), input.value);
  });

  clearCartBtn.addEventListener("click", function () {
    if (cartItems.length === 0) {
      return;
    }
    cartItems = [];
    saveCart();
    showFeedback("Your basket has been cleared.", false);
    renderCart();
  });

  restoreSampleBtn.addEventListener("click", function () {
    cartItems = defaultCartItems.map(sanitizeCartItem).filter(Boolean);
    saveCart();
    showFeedback("Sample bakery basket restored.", false);
    renderCart();
  });

  promoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var code = promoInput.value.trim().toUpperCase();
    if (!code) {
      promoFeedback.textContent = "Please enter a promo code (try SWEET10).";
      promoFeedback.className = "form-text mt-1 text-danger fw-semibold";
      return;
    }
    if (cartItems.length === 0) {
      promoFeedback.textContent = "Add at least one item to your basket before applying a promo code.";
      promoFeedback.className = "form-text mt-1 text-danger fw-semibold";
      return;
    }
    var matched = findPromo(code);
    if (!matched) {
      promoFeedback.textContent = "Invalid promo code '" + code + "'. Try SWEET10 for 10% off.";
      promoFeedback.className = "form-text mt-1 text-danger fw-semibold";
      return;
    }
    activePromoCode = matched.code;
    savePromo(activePromoCode);
    updateSummary();
  });

  removePromoBtn.addEventListener("click", function () {
    activePromoCode = "";
    promoInput.value = "";
    savePromo("");
    updateSummary();
  });

  proceedCheckoutBtn.addEventListener("click", function (event) {
    if (cartItems.length === 0) {
      event.preventDefault();
      showFeedback("Your basket is empty. Add at least one bakery item before checking out.", true);
    }
  });

  quickAddGrid.addEventListener("click", function (event) {
    var btn = event.target.closest("button[data-add-id]");
    if (!btn) {
      return;
    }
    addCatalogItem(btn.getAttribute("data-add-id"));
  });

  bakerySearchInput.addEventListener("input", function () {
    renderQuickAdd(bakerySearchInput.value);
  });

  clearSearchBtn.addEventListener("click", function () {
    bakerySearchInput.value = "";
    renderQuickAdd("");
    bakerySearchInput.focus();
  });

  // Initial render
  renderCart();
  renderQuickAdd("");
})();
