(function (global) {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var CART_INIT_KEY = "sweetOvenCartInitialized";
  var FAVORITES_KEY = "sweetOvenFavorites";
  var MAX_ITEM_QTY = 20;

  function formatPKR(amount) {
    var num = Number(amount);
    if (!Number.isFinite(num)) {
      num = 0;
    }
    return "PKR " + Math.round(num).toLocaleString("en-PK");
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
      price: Math.round(price),
      quantity: qty,
      image: String(item.image || "../images/chocolate-fudge-cake.svg"),
      alt: String(item.alt || item.name)
    };
  }

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map(sanitizeCartItem).filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  function saveCart(items) {
    try {
      localStorage.setItem(CART_INIT_KEY, "true");
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      updateNavCartBadge();
      return true;
    } catch (err) {
      return false;
    }
  }

  function addToCart(newItem) {
    var clean = sanitizeCartItem(newItem);
    if (!clean) {
      return { ok: false, message: "Unable to add this item right now." };
    }

    var cart = getCart();
    var existingIndex = -1;
    for (var i = 0; i < cart.length; i += 1) {
      if (cart[i].id === clean.id) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex !== -1) {
      var combined = cart[existingIndex].quantity + clean.quantity;
      if (combined > MAX_ITEM_QTY) {
        cart[existingIndex].quantity = MAX_ITEM_QTY;
        saveCart(cart);
        return {
          ok: true,
          capped: true,
          quantity: MAX_ITEM_QTY,
          message: clean.name + " basket quantity reached the max limit of " + MAX_ITEM_QTY + "."
        };
      }
      cart[existingIndex].quantity = combined;
      saveCart(cart);
      return {
        ok: true,
        capped: false,
        quantity: combined,
        message: "Updated " + clean.name + " (" + clean.weight + ") in your basket — total " + combined + "."
      };
    }

    cart.push(clean);
    saveCart(cart);
    return {
      ok: true,
      capped: false,
      quantity: clean.quantity,
      message: "Added " + clean.quantity + " x " + clean.name + " (" + clean.weight + ") to your basket."
    };
  }

  function getTotalCartCount() {
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i += 1) {
      count += cart[i].quantity;
    }
    return count;
  }

  function updateNavCartBadge() {
    var badge = document.getElementById("navCartCount");
    if (!badge) {
      return;
    }
    var count = getTotalCartCount();
    badge.textContent = String(count);
    badge.setAttribute("aria-label", count + " items in basket");
  }

  function getFavorites() {
    try {
      var raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (err) {
      return [];
    }
  }

  function isFavorite(itemId) {
    var favs = getFavorites();
    return favs.indexOf(String(itemId)) !== -1;
  }

  function toggleFavorite(itemId) {
    var id = String(itemId);
    var favs = getFavorites();
    var index = favs.indexOf(id);
    var added = false;
    if (index === -1) {
      favs.push(id);
      added = true;
    } else {
      favs.splice(index, 1);
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (err) {
      // Gracefully ignore storage errors
    }
    return added;
  }

  function initNavbarToggle() {
    var toggler = document.querySelector(".navbar-toggler");
    var collapse = document.getElementById("mainNavbar");
    if (!toggler || !collapse) {
      return;
    }

    function closeMenu() {
      collapse.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
    }

    toggler.addEventListener("click", function () {
      var isOpen = collapse.classList.toggle("show");
      toggler.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    collapse.addEventListener("click", function (event) {
      if (event.target && event.target.classList.contains("nav-link")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && collapse.classList.contains("show")) {
        closeMenu();
        toggler.focus();
      }
    });
  }

  function initSharedShell() {
    initNavbarToggle();
    updateNavCartBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSharedShell);
  } else {
    initSharedShell();
  }

  global.SweetOvenShared = {
    MAX_ITEM_QTY: MAX_ITEM_QTY,
    formatPKR: formatPKR,
    getCart: getCart,
    addToCart: addToCart,
    getTotalCartCount: getTotalCartCount,
    updateNavCartBadge: updateNavCartBadge,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite
  };
})(window);
