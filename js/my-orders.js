/* ==========================================================================
   The Sweet Oven - My Orders Page Script (pages/my-orders.html)
   Pure vanilla JavaScript. Reads/writes existing Sweet Oven localStorage keys:
     - sweetOvenOrders (read, and update status to "Cancelled" on cancel)
     - sweetOvenLastOrder (update status if matching cancelled orderId)
     - sweetOvenCart / sweetOvenCartInitialized (read/write on Reorder)
   Auth via window.SweetOvenAuth.getCurrentUser().
   ========================================================================== */

(function () {
  "use strict";

  var ORDERS_STORAGE_KEY = "sweetOvenOrders";
  var LAST_ORDER_KEY = "sweetOvenLastOrder";
  var CART_STORAGE_KEY = "sweetOvenCart";
  var CART_INIT_KEY = "sweetOvenCartInitialized";
  var MAX_CART_QTY = 20;

  var state = {
    user: null,
    userOrders: [],
    activeStatus: "All",
    searchQuery: "",
    selectedOrderId: "",
    activeModalOrderId: "",
    pendingCancelOrderId: ""
  };

  var activeModalEl = null;
  var lastFocusedEl = null;

  // Safe localStorage helpers (all reads/writes wrapped in try/catch)
  function safeGetItem(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (err) {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      if (!window.localStorage) return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function safeParseJSON(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function formatRs(amount) {
    var num = Number(amount);
    if (!Number.isFinite(num)) num = 0;
    return "Rs " + Math.round(num).toLocaleString("en-PK");
  }

  function formatOrderNumber(orderId) {
    var clean = String(orderId || "").trim();
    if (!clean) return "#N/A";
    return clean.charAt(0) === "#" ? clean : "#" + clean;
  }

  function formatOrderDate(rawDate) {
    if (!rawDate) return "Date unavailable";
    var dt = new Date(rawDate);
    if (Number.isNaN(dt.getTime())) {
      return String(rawDate);
    }
    try {
      return dt.toLocaleString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch (err) {
      return dt.toDateString();
    }
  }

  function getOrderId(order) {
    if (!order || typeof order !== "object") return "";
    return String(order.orderId || order.id || "").trim();
  }

  function getOrderEmail(order) {
    if (!order || typeof order !== "object") return "";
    if (order.userEmail) {
      return normalizeEmail(order.userEmail);
    }
    if (order.customerEmail) {
      return normalizeEmail(order.customerEmail);
    }
    if (order.customer && typeof order.customer === "object" && order.customer.email) {
      return normalizeEmail(order.customer.email);
    }
    return normalizeEmail(order.email || "");
  }

  // Normalize missing or checkout statuses ("Confirmed — Baking Soon") into filter statuses
  function getOrderStatus(order) {
    var raw = order && typeof order.status === "string" ? order.status.trim() : "";
    if (!raw) return "Pending";

    var lower = raw.toLowerCase();
    if (lower.indexOf("cancel") !== -1) return "Cancelled";
    if (lower.indexOf("deliver") !== -1 || lower === "completed") return "Delivered";
    if (lower.indexOf("on the way") !== -1 || lower.indexOf("out for delivery") !== -1 || lower.indexOf("dispatch") !== -1) {
      return "On the way";
    }
    if (lower === "pending" || lower.indexOf("confirm") !== -1 || lower.indexOf("baking") !== -1) {
      return "Pending";
    }
    return "Pending";
  }

  function getStatusBadgeClass(status) {
    if (status === "Delivered") return "status-badge status-badge-delivered";
    if (status === "Cancelled") return "status-badge status-badge-cancelled";
    if (status === "On the way") return "status-badge status-badge-ontheway";
    return "status-badge status-badge-pending";
  }

  function getOrderItems(order) {
    if (!order || !Array.isArray(order.items)) return [];
    var clean = [];
    for (var i = 0; i < order.items.length; i += 1) {
      var item = order.items[i];
      if (!item || typeof item !== "object") continue;
      var name = String(item.name || item.title || "").trim();
      if (!name) continue;
      var qty = parseInt(item.quantity, 10);
      if (!Number.isInteger(qty) || qty < 1) qty = 1;
      var price = Number(item.price);
      if (!Number.isFinite(price) || price < 0) price = 0;
      clean.push({
        id: String(item.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
        name: name,
        category: String(item.category || "Bakery Treat"),
        weight: String(item.weight || "Standard Pack"),
        price: price,
        quantity: qty,
        image: String(item.image || "../images/chocolate-fudge-cake.svg"),
        alt: String(item.alt || name)
      });
    }
    return clean;
  }

  // Compute subtotal, discount, delivery charge, and calculated total safely
  function getOrderPricing(order) {
    var items = getOrderItems(order);
    var itemsSubtotal = 0;
    for (var i = 0; i < items.length; i += 1) {
      itemsSubtotal += items[i].price * items[i].quantity;
    }

    var pricing = order && order.pricing && typeof order.pricing === "object" ? order.pricing : {};
    var hasStoredSubtotal = Number.isFinite(Number(pricing.subtotal)) || Number.isFinite(Number(order && order.subtotal));
    var subtotal = hasStoredSubtotal
      ? Number(pricing.subtotal != null ? pricing.subtotal : order.subtotal)
      : itemsSubtotal;
    if (!Number.isFinite(subtotal) || subtotal < 0) subtotal = itemsSubtotal;

    var rawDiscount = pricing.discount != null ? pricing.discount : (order && order.discount);
    var discount = Number(rawDiscount);
    var hasDiscount = rawDiscount != null && Number.isFinite(discount) && discount > 0;
    if (!Number.isFinite(discount) || discount < 0) discount = 0;

    var rawDelivery = pricing.deliveryFee != null
      ? pricing.deliveryFee
      : (order && order.deliveryFee != null ? order.deliveryFee : (order && order.deliveryCharge));
    var deliveryFee = Number(rawDelivery);
    var hasDelivery = rawDelivery != null && Number.isFinite(deliveryFee) && deliveryFee >= 0;
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0) deliveryFee = 0;

    var storedTotal = Number(pricing.total != null ? pricing.total : (order && order.total));
    var calculatedTotal = Math.max(0, subtotal - discount + deliveryFee);

    // If order has no items and no subtotal, fall back to storedTotal if valid
    if (items.length === 0 && !hasStoredSubtotal && Number.isFinite(storedTotal) && storedTotal >= 0) {
      calculatedTotal = storedTotal;
      subtotal = storedTotal;
    }

    return {
      subtotal: subtotal,
      discount: discount,
      hasDiscount: hasDiscount,
      deliveryFee: deliveryFee,
      hasDelivery: hasDelivery,
      total: calculatedTotal
    };
  }

  function loadAllOrders() {
    var parsed = safeParseJSON(safeGetItem(ORDERS_STORAGE_KEY), []);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(function (entry) {
      return entry && typeof entry === "object";
    });
  }

  function saveAllOrders(orders) {
    return safeSetItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }

  function loadCart() {
    var parsed = safeParseJSON(safeGetItem(CART_STORAGE_KEY), []);
    if (!Array.isArray(parsed)) return [];
    var clean = [];
    for (var i = 0; i < parsed.length; i += 1) {
      var item = parsed[i];
      if (!item || typeof item !== "object" || !item.id || !item.name) continue;
      var price = Number(item.price);
      var qty = parseInt(item.quantity, 10);
      if (!Number.isFinite(price) || price <= 0) continue;
      if (!Number.isInteger(qty) || qty < 1) qty = 1;
      if (qty > MAX_CART_QTY) qty = MAX_CART_QTY;
      clean.push({
        id: String(item.id),
        name: String(item.name),
        category: String(item.category || "Bakery Treat"),
        weight: String(item.weight || "Standard Pack"),
        price: price,
        quantity: qty,
        image: String(item.image || "../images/chocolate-fudge-cake.svg"),
        alt: String(item.alt || item.name)
      });
    }
    return clean;
  }

  function updateNavCartCount() {
    var badge = document.getElementById("navCartCount");
    if (!badge) return;
    var cart = loadCart();
    var count = 0;
    for (var i = 0; i < cart.length; i += 1) {
      count += cart[i].quantity;
    }
    badge.textContent = String(count);
    badge.setAttribute("aria-label", count + " items in cart");
  }

  function loadUserOrders(userEmail) {
    var target = normalizeEmail(userEmail);
    if (!target) return [];
    var all = loadAllOrders();
    var indexed = [];
    for (var i = 0; i < all.length; i += 1) {
      if (getOrderEmail(all[i]) === target) {
        indexed.push({ order: all[i], idx: i });
      }
    }

    // Sort newest first by timestamp, preserving array order when dates are equal or missing
    indexed.sort(function (a, b) {
      var ta = Date.parse(a.order.createdAt || a.order.date || "");
      var tb = Date.parse(b.order.createdAt || b.order.date || "");
      var validA = !Number.isNaN(ta);
      var validB = !Number.isNaN(tb);
      if (validA && validB && tb !== ta) {
        return tb - ta;
      }
      if (validA !== validB) {
        return validB ? 1 : -1;
      }
      return a.idx - b.idx;
    });

    return indexed.map(function (entry) {
      return entry.order;
    });
  }

  function findUserOrderById(orderId) {
    for (var i = 0; i < state.userOrders.length; i += 1) {
      if (getOrderId(state.userOrders[i]) === orderId) {
        return state.userOrders[i];
      }
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var loggedOutSection = document.getElementById("loggedOutSection");
    var ordersWorkspace = document.getElementById("ordersWorkspace");
    var summaryOrderCount = document.getElementById("summaryOrderCount");
    var summaryTotalSpent = document.getElementById("summaryTotalSpent");
    var ordersFeedback = document.getElementById("ordersFeedback");

    var statusFilterGroup = document.getElementById("statusFilterGroup");
    var orderSearchInput = document.getElementById("orderSearchInput");
    var clearSearchBtn = document.getElementById("clearSearchBtn");
    var resetFiltersBtn = document.getElementById("resetFiltersBtn");

    var loyaltyPointsText = document.getElementById("loyaltyPointsText");
    var loyaltyMemberInfo = document.getElementById("loyaltyMemberInfo");
    var loyaltySelectedLabel = document.getElementById("loyaltySelectedLabel");
    var loyaltyReorderBtn = document.getElementById("loyaltyReorderBtn");
    var loyaltyDetailsBtn = document.getElementById("loyaltyDetailsBtn");

    var noOrdersState = document.getElementById("noOrdersState");
    var noFilterResultsState = document.getElementById("noFilterResultsState");
    var ordersList = document.getElementById("ordersList");

    var orderDetailsModal = document.getElementById("orderDetailsModal");
    var detailsModalTitle = document.getElementById("detailsModalTitle");
    var detailsModalBody = document.getElementById("detailsModalBody");
    var detailsModalReorderBtn = document.getElementById("detailsModalReorderBtn");
    var closeDetailsModalBtn = document.getElementById("closeDetailsModalBtn");
    var closeDetailsModalFooterBtn = document.getElementById("closeDetailsModalFooterBtn");

    var cancelOrderModal = document.getElementById("cancelOrderModal");
    var cancelModalMessage = document.getElementById("cancelModalMessage");
    var closeCancelModalBtn = document.getElementById("closeCancelModalBtn");
    var keepOrderBtn = document.getElementById("keepOrderBtn");
    var confirmCancelOrderBtn = document.getElementById("confirmCancelOrderBtn");

    function showFeedback(message, type, showCartLink) {
      ordersFeedback.textContent = "";
      ordersFeedback.className = "orders-feedback mb-4 " + (type === "error" ? "is-error" : "is-success");
      ordersFeedback.setAttribute("role", type === "error" ? "alert" : "status");

      var msgSpan = document.createElement("span");
      msgSpan.textContent = message;
      ordersFeedback.appendChild(msgSpan);

      if (showCartLink) {
        var cartLink = document.createElement("a");
        cartLink.href = "cart.html";
        cartLink.className = "orders-feedback-link";
        cartLink.textContent = "Go to Cart";
        ordersFeedback.appendChild(cartLink);
      }
    }

    function clearFeedback() {
      ordersFeedback.textContent = "";
      ordersFeedback.className = "orders-feedback d-none mb-4";
    }

    function getFilteredOrders() {
      var q = state.searchQuery.trim().toLowerCase().replace(/^#/, "");
      return state.userOrders.filter(function (order) {
        var status = getOrderStatus(order);
        var matchesStatus = state.activeStatus === "All" || status === state.activeStatus;
        var idLower = getOrderId(order).toLowerCase().replace(/^#/, "");
        var matchesSearch = !q || idLower.indexOf(q) !== -1;
        return matchesStatus && matchesSearch;
      });
    }

    function updateSelectedOrderUI(filteredOrders) {
      var list = Array.isArray(filteredOrders) ? filteredOrders : getFilteredOrders();
      var selectedOrder = findUserOrderById(state.selectedOrderId);
      var isVisible = selectedOrder && list.indexOf(selectedOrder) !== -1;
      if (!isVisible) {
        selectedOrder = list.length > 0 ? list[0] : null;
        state.selectedOrderId = selectedOrder ? getOrderId(selectedOrder) : "";
      }

      if (selectedOrder) {
        var pricing = getOrderPricing(selectedOrder);
        loyaltySelectedLabel.textContent =
          formatOrderNumber(getOrderId(selectedOrder)) + " — " + formatRs(pricing.total);
        loyaltyReorderBtn.disabled = false;
        loyaltyDetailsBtn.disabled = false;
      } else {
        loyaltySelectedLabel.textContent = "No order selected";
        loyaltyReorderBtn.disabled = true;
        loyaltyDetailsBtn.disabled = true;
      }

      var cards = ordersList.querySelectorAll(".order-card[data-order-id]");
      for (var i = 0; i < cards.length; i += 1) {
        var cardId = cards[i].getAttribute("data-order-id") || "";
        cards[i].classList.toggle("is-selected", cardId === state.selectedOrderId);
      }
    }

    function renderSummaryAndLoyalty(filteredOrders) {
      var orderCount = state.userOrders.length;
      var totalSpent = 0;

      for (var i = 0; i < state.userOrders.length; i += 1) {
        if (getOrderStatus(state.userOrders[i]) !== "Cancelled") {
          totalSpent += getOrderPricing(state.userOrders[i]).total;
        }
      }

      summaryOrderCount.textContent = String(orderCount);
      summaryTotalSpent.textContent = formatRs(totalSpent);

      var points = Number(state.user && state.user.points);
      var safePoints = Number.isFinite(points) && points >= 0 ? Math.floor(points) : 0;
      loyaltyPointsText.textContent = "Loyalty " + safePoints + " pts";
      loyaltyMemberInfo.textContent = state.user.fullName + " • " + state.user.email;

      updateSelectedOrderUI(filteredOrders);
    }

    function buildOrderSummaryLine(order, items, status, pricing) {
      var orderNum = formatOrderNumber(getOrderId(order));
      var leadItem = items.length > 0 ? items[0].name : "Bakery Order";
      var extraCount = items.length > 1 ? " (+ " + (items.length - 1) + " more)" : "";
      return orderNum + " " + leadItem + extraCount + " – " + formatRs(pricing.total) + " | " + status;
    }

    function renderOrdersList() {
      var filtered = getFilteredOrders();
      renderSummaryAndLoyalty(filtered);

      ordersList.innerHTML = "";
      clearSearchBtn.classList.toggle("d-none", state.searchQuery.trim() === "");

      if (state.userOrders.length === 0) {
        noOrdersState.classList.remove("d-none");
        noFilterResultsState.classList.add("d-none");
        return;
      }

      noOrdersState.classList.add("d-none");

      if (filtered.length === 0) {
        noFilterResultsState.classList.remove("d-none");
        return;
      }

      noFilterResultsState.classList.add("d-none");

      for (var i = 0; i < filtered.length; i += 1) {
        var order = filtered[i];
        var orderId = getOrderId(order);
        var status = getOrderStatus(order);
        var items = getOrderItems(order);
        var pricing = getOrderPricing(order);

        var card = document.createElement("article");
        card.className = "card order-card" + (orderId === state.selectedOrderId ? " is-selected" : "");
        card.setAttribute("data-order-id", orderId);

        // Headline row: "#1021 Fudge Cake – Rs 2,800 | Delivered" + Status Badge
        var headline = document.createElement("div");
        headline.className = "order-card-headline";

        var summaryLine = document.createElement("h2");
        summaryLine.className = "order-summary-line";
        summaryLine.textContent = buildOrderSummaryLine(order, items, status, pricing);

        var badge = document.createElement("span");
        badge.className = getStatusBadgeClass(status);
        badge.textContent = status;

        headline.appendChild(summaryLine);
        headline.appendChild(badge);
        card.appendChild(headline);

        // Date & Delivery Meta
        var metaRow = document.createElement("div");
        metaRow.className = "order-meta-row";

        var dateEl = document.createElement("span");
        dateEl.textContent = "Placed: " + formatOrderDate(order.createdAt || order.date);

        var countEl = document.createElement("span");
        var totalUnits = 0;
        for (var u = 0; u < items.length; u += 1) {
          totalUnits += items[u].quantity;
        }
        countEl.textContent = totalUnits + (totalUnits === 1 ? " item" : " items");

        metaRow.appendChild(dateEl);
        metaRow.appendChild(countEl);
        card.appendChild(metaRow);

        // Item names with quantities and line prices
        var itemsUl = document.createElement("ul");
        itemsUl.className = "order-items-ul";

        if (items.length === 0) {
          var emptyLi = document.createElement("li");
          emptyLi.className = "order-item-row";
          emptyLi.textContent = "No item breakdown stored for this order.";
          itemsUl.appendChild(emptyLi);
        } else {
          for (var j = 0; j < items.length; j += 1) {
            var item = items[j];
            var li = document.createElement("li");
            li.className = "order-item-row";

            var nameSpan = document.createElement("span");
            nameSpan.className = "order-item-name";
            nameSpan.textContent = item.quantity + " × " + item.name;

            var priceSpan = document.createElement("span");
            priceSpan.className = "order-item-price";
            priceSpan.textContent = formatRs(item.price * item.quantity);

            li.appendChild(nameSpan);
            li.appendChild(priceSpan);
            itemsUl.appendChild(li);
          }
        }
        card.appendChild(itemsUl);

        // Footer: Total + Action buttons
        var footer = document.createElement("div");
        footer.className = "order-card-footer";

        var totalWrap = document.createElement("div");
        totalWrap.className = "order-total-display";
        totalWrap.innerHTML = "<span>Total:</span>";
        var totalStrong = document.createElement("strong");
        totalStrong.className = "order-total-amount";
        totalStrong.textContent = formatRs(pricing.total);
        totalWrap.appendChild(totalStrong);

        var actionsRow = document.createElement("div");
        actionsRow.className = "order-actions-row";

        var detailsBtn = document.createElement("button");
        detailsBtn.type = "button";
        detailsBtn.className = "btn btn-outline-bakery btn-sm";
        detailsBtn.textContent = "Details";
        detailsBtn.setAttribute("data-action", "details");
        detailsBtn.setAttribute("data-order-id", orderId);
        detailsBtn.setAttribute("aria-label", "View details for order " + formatOrderNumber(orderId));

        var reorderBtn = document.createElement("button");
        reorderBtn.type = "button";
        reorderBtn.className = "btn btn-bakery btn-sm";
        reorderBtn.textContent = "Reorder";
        reorderBtn.setAttribute("data-action", "reorder");
        reorderBtn.setAttribute("data-order-id", orderId);
        reorderBtn.setAttribute("aria-label", "Reorder items from order " + formatOrderNumber(orderId));

        actionsRow.appendChild(detailsBtn);
        actionsRow.appendChild(reorderBtn);

        if (status === "Pending") {
          var cancelBtn = document.createElement("button");
          cancelBtn.type = "button";
          cancelBtn.className = "btn btn-danger-outline btn-sm";
          cancelBtn.textContent = "Cancel order";
          cancelBtn.setAttribute("data-action", "cancel");
          cancelBtn.setAttribute("data-order-id", orderId);
          cancelBtn.setAttribute("aria-label", "Cancel order " + formatOrderNumber(orderId));
          actionsRow.appendChild(cancelBtn);
        }

        footer.appendChild(totalWrap);
        footer.appendChild(actionsRow);
        card.appendChild(footer);

        ordersList.appendChild(card);
      }
    }

    function reorderOrder(orderId) {
      var order = findUserOrderById(orderId);
      if (!order) {
        showFeedback("Could not find that order to reorder.", "error", false);
        return;
      }

      var items = getOrderItems(order);
      if (items.length === 0) {
        showFeedback("Cannot reorder: this order has no items.", "error", false);
        return;
      }

      var cart = loadCart();
      var capped = false;

      for (var i = 0; i < items.length; i += 1) {
        var orderItem = items[i];
        var existing = null;
        for (var j = 0; j < cart.length; j += 1) {
          if (cart[j].id === orderItem.id) {
            existing = cart[j];
            break;
          }
        }

        if (existing) {
          var nextQty = existing.quantity + orderItem.quantity;
          if (nextQty > MAX_CART_QTY) {
            nextQty = MAX_CART_QTY;
            capped = true;
          }
          existing.quantity = nextQty;
        } else {
          var startQty = orderItem.quantity;
          if (startQty > MAX_CART_QTY) {
            startQty = MAX_CART_QTY;
            capped = true;
          }
          cart.push({
            id: orderItem.id,
            name: orderItem.name,
            category: orderItem.category,
            weight: orderItem.weight,
            price: orderItem.price > 0 ? orderItem.price : 1,
            quantity: startQty,
            image: orderItem.image,
            alt: orderItem.alt
          });
        }
      }

      var saved = safeSetItem(CART_STORAGE_KEY, JSON.stringify(cart));
      safeSetItem(CART_INIT_KEY, "true");
      if (!saved) {
        showFeedback("Could not save items to your cart in browser storage.", "error", false);
        return;
      }

      updateNavCartCount();
      var note = capped ? " (item quantities capped at " + MAX_CART_QTY + " max)" : "";
      showFeedback("Added to cart from order " + formatOrderNumber(orderId) + note + ".", "success", true);
    }

    // Accessible Vanilla Modal Helpers (focus trap, Esc, outside click, focus restore)
    function getFocusableElements(container) {
      var selectors = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
      var nodes = container.querySelectorAll(selectors);
      var visible = [];
      for (var i = 0; i < nodes.length; i += 1) {
        if (nodes[i].offsetParent !== null) {
          visible.push(nodes[i]);
        }
      }
      return visible;
    }

    function openModal(modalEl, triggerEl) {
      lastFocusedEl = triggerEl || document.activeElement;
      activeModalEl = modalEl;
      modalEl.hidden = false;
      modalEl.classList.remove("d-none");
      document.body.classList.add("modal-open");

      var focusables = getFocusableElements(modalEl);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function closeActiveModal() {
      if (!activeModalEl) return;
      activeModalEl.classList.add("d-none");
      activeModalEl.hidden = true;
      document.body.classList.remove("modal-open");
      activeModalEl = null;

      if (lastFocusedEl && typeof lastFocusedEl.focus === "function" && document.contains(lastFocusedEl)) {
        lastFocusedEl.focus();
      }
      lastFocusedEl = null;
    }

    function openDetailsModal(orderId, triggerEl) {
      var order = findUserOrderById(orderId);
      if (!order) return;

      state.activeModalOrderId = orderId;
      var status = getOrderStatus(order);
      var items = getOrderItems(order);
      var pricing = getOrderPricing(order);

      detailsModalTitle.textContent = "Order " + formatOrderNumber(orderId);
      detailsModalBody.innerHTML = "";

      // Top metadata summary
      var metaBox = document.createElement("div");
      metaBox.className = "modal-meta-box";

      var metaTop = document.createElement("div");
      metaTop.className = "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2";
      var dateStrong = document.createElement("strong");
      dateStrong.textContent = "Placed: " + formatOrderDate(order.createdAt || order.date);
      var badge = document.createElement("span");
      badge.className = getStatusBadgeClass(status);
      badge.textContent = status;
      metaTop.appendChild(dateStrong);
      metaTop.appendChild(badge);
      metaBox.appendChild(metaTop);

      if (order.delivery && order.delivery.address) {
        var addrP = document.createElement("p");
        addrP.className = "mb-1";
        addrP.textContent = "Delivery: " + order.delivery.address;
        metaBox.appendChild(addrP);
      }
      if (order.delivery && (order.delivery.date || order.delivery.slotLabel)) {
        var slotP = document.createElement("p");
        slotP.className = "mb-1";
        slotP.textContent = "Schedule: " + (order.delivery.date || "") + (order.delivery.slotLabel ? " • " + order.delivery.slotLabel : "");
        metaBox.appendChild(slotP);
      }
      if (order.payment && order.payment.methodLabel) {
        var payP = document.createElement("p");
        payP.className = "mb-0";
        payP.textContent = "Payment: " + order.payment.methodLabel;
        metaBox.appendChild(payP);
      }
      detailsModalBody.appendChild(metaBox);

      // Items table
      var table = document.createElement("table");
      table.className = "modal-items-table";
      var thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>Item</th><th class='text-end'>Qty</th><th class='text-end'>Unit Price</th><th class='text-end'>Line Total</th></tr>";
      table.appendChild(thead);

      var tbody = document.createElement("tbody");
      if (items.length === 0) {
        var emptyTr = document.createElement("tr");
        var emptyTd = document.createElement("td");
        emptyTd.colSpan = 4;
        emptyTd.textContent = "No items recorded on this order.";
        emptyTr.appendChild(emptyTd);
        tbody.appendChild(emptyTr);
      } else {
        for (var i = 0; i < items.length; i += 1) {
          var item = items[i];
          var tr = document.createElement("tr");

          var nameTd = document.createElement("td");
          nameTd.textContent = item.name;
          var qtyTd = document.createElement("td");
          qtyTd.className = "text-end";
          qtyTd.textContent = String(item.quantity);
          var unitTd = document.createElement("td");
          unitTd.className = "text-end";
          unitTd.textContent = formatRs(item.price);
          var lineTd = document.createElement("td");
          lineTd.className = "text-end fw-bold";
          lineTd.textContent = formatRs(item.price * item.quantity);

          tr.appendChild(nameTd);
          tr.appendChild(qtyTd);
          tr.appendChild(unitTd);
          tr.appendChild(lineTd);
          tbody.appendChild(tr);
        }
      }
      table.appendChild(tbody);
      detailsModalBody.appendChild(table);

      // Pricing Breakdown
      var dl = document.createElement("dl");
      dl.className = "modal-pricing-list";

      function addPricingRow(label, value, isTotal) {
        var row = document.createElement("div");
        row.className = "modal-pricing-row" + (isTotal ? " is-total" : "");
        var dt = document.createElement("dt");
        dt.textContent = label;
        var dd = document.createElement("dd");
        dd.className = "mb-0";
        dd.textContent = value;
        row.appendChild(dt);
        row.appendChild(dd);
        dl.appendChild(row);
      }

      addPricingRow("Subtotal", formatRs(pricing.subtotal), false);
      if (pricing.hasDiscount) {
        var promoLabel = order.promoCode ? "Discount (" + order.promoCode + ")" : "Discount";
        addPricingRow(promoLabel, "- " + formatRs(pricing.discount), false);
      }
      if (pricing.hasDelivery) {
        addPricingRow("Delivery Charge", pricing.deliveryFee === 0 ? "Free (Rs 0)" : formatRs(pricing.deliveryFee), false);
      }
      addPricingRow("Calculated Total", formatRs(pricing.total), true);

      detailsModalBody.appendChild(dl);
      openModal(orderDetailsModal, triggerEl);
    }

    function openCancelModal(orderId, triggerEl) {
      var order = findUserOrderById(orderId);
      if (!order || getOrderStatus(order) !== "Pending") return;

      state.pendingCancelOrderId = orderId;
      cancelModalMessage.textContent =
        "Are you sure you want to cancel order " + formatOrderNumber(orderId) + "? This action updates its status to Cancelled.";
      openModal(cancelOrderModal, triggerEl);
    }

    function confirmCancelOrder() {
      var orderId = state.pendingCancelOrderId;
      if (!orderId) return;

      var allOrders = loadAllOrders();
      var updated = false;
      var targetEmail = normalizeEmail(state.user && state.user.email);

      for (var i = 0; i < allOrders.length; i += 1) {
        if (getOrderId(allOrders[i]) === orderId && getOrderEmail(allOrders[i]) === targetEmail) {
          allOrders[i].status = "Cancelled";
          updated = true;
          break;
        }
      }

      if (!updated || !saveAllOrders(allOrders)) {
        closeActiveModal();
        showFeedback("Unable to cancel this order in browser storage.", "error", false);
        return;
      }

      // Sync sweetOvenLastOrder if it points to the cancelled order
      var lastOrder = safeParseJSON(safeGetItem(LAST_ORDER_KEY), null);
      if (lastOrder && typeof lastOrder === "object" && getOrderId(lastOrder) === orderId) {
        lastOrder.status = "Cancelled";
        safeSetItem(LAST_ORDER_KEY, JSON.stringify(lastOrder));
      }

      state.pendingCancelOrderId = "";
      state.userOrders = loadUserOrders(state.user.email);
      closeActiveModal();
      renderOrdersList();
      showFeedback("Order " + formatOrderNumber(orderId) + " has been cancelled.", "success", false);

      // Return focus to the updated order's Details button if visible, else feedback banner
      var updatedDetailsBtn = ordersList.querySelector('button[data-action="details"][data-order-id="' + orderId.replace(/"/g, '\\"') + '"]');
      if (updatedDetailsBtn) {
        updatedDetailsBtn.focus();
      } else {
        ordersFeedback.setAttribute("tabindex", "-1");
        ordersFeedback.focus();
      }
    }

    function renderAuthGate() {
      var auth = window.SweetOvenAuth;
      state.user = auth && typeof auth.getCurrentUser === "function" ? auth.getCurrentUser() : null;

      if (!state.user) {
        state.userOrders = [];
        state.selectedOrderId = "";
        loggedOutSection.classList.remove("d-none");
        ordersWorkspace.classList.add("d-none");
        return;
      }

      loggedOutSection.classList.add("d-none");
      ordersWorkspace.classList.remove("d-none");
      state.userOrders = loadUserOrders(state.user.email);
      state.selectedOrderId = state.userOrders.length > 0 ? getOrderId(state.userOrders[0]) : "";
      renderOrdersList();
    }

    // Filter buttons
    statusFilterGroup.addEventListener("click", function (event) {
      var btn = event.target.closest("button[data-status]");
      if (!btn) return;
      state.activeStatus = btn.getAttribute("data-status") || "All";

      var buttons = statusFilterGroup.querySelectorAll("button[data-status]");
      for (var i = 0; i < buttons.length; i += 1) {
        var active = buttons[i] === btn;
        buttons[i].classList.toggle("is-active", active);
        buttons[i].setAttribute("aria-pressed", String(active));
      }

      renderOrdersList();
    });

    // Order number search
    orderSearchInput.addEventListener("input", function () {
      state.searchQuery = orderSearchInput.value;
      renderOrdersList();
    });

    clearSearchBtn.addEventListener("click", function () {
      state.searchQuery = "";
      orderSearchInput.value = "";
      renderOrdersList();
      orderSearchInput.focus();
    });

    resetFiltersBtn.addEventListener("click", function () {
      state.activeStatus = "All";
      state.searchQuery = "";
      orderSearchInput.value = "";
      var buttons = statusFilterGroup.querySelectorAll("button[data-status]");
      for (var i = 0; i < buttons.length; i += 1) {
        var isAll = buttons[i].getAttribute("data-status") === "All";
        buttons[i].classList.toggle("is-active", isAll);
        buttons[i].setAttribute("aria-pressed", String(isAll));
      }
      renderOrdersList();
    });

    // Order card click & action buttons (event delegation; avoids destroying DOM so modal focus returns cleanly)
    ordersList.addEventListener("click", function (event) {
      var actionBtn = event.target.closest("button[data-action]");
      if (actionBtn) {
        var action = actionBtn.getAttribute("data-action");
        var orderId = actionBtn.getAttribute("data-order-id");
        state.selectedOrderId = orderId;
        updateSelectedOrderUI();

        if (action === "details") {
          openDetailsModal(orderId, actionBtn);
        } else if (action === "reorder") {
          reorderOrder(orderId);
        } else if (action === "cancel") {
          openCancelModal(orderId, actionBtn);
        }
        return;
      }

      var card = event.target.closest(".order-card[data-order-id]");
      if (card) {
        state.selectedOrderId = card.getAttribute("data-order-id") || "";
        updateSelectedOrderUI();
      }
    });

    // Loyalty card Reorder & Details buttons for the selected order
    loyaltyReorderBtn.addEventListener("click", function () {
      if (state.selectedOrderId) {
        reorderOrder(state.selectedOrderId);
      }
    });

    loyaltyDetailsBtn.addEventListener("click", function () {
      if (state.selectedOrderId) {
        openDetailsModal(state.selectedOrderId, loyaltyDetailsBtn);
      }
    });

    // Modal button & backdrop events
    closeDetailsModalBtn.addEventListener("click", closeActiveModal);
    closeDetailsModalFooterBtn.addEventListener("click", closeActiveModal);
    detailsModalReorderBtn.addEventListener("click", function () {
      var id = state.activeModalOrderId;
      closeActiveModal();
      reorderOrder(id);
    });

    closeCancelModalBtn.addEventListener("click", closeActiveModal);
    keepOrderBtn.addEventListener("click", closeActiveModal);
    confirmCancelOrderBtn.addEventListener("click", confirmCancelOrder);

    [orderDetailsModal, cancelOrderModal].forEach(function (modalEl) {
      modalEl.addEventListener("click", function (event) {
        if (event.target === modalEl) {
          closeActiveModal();
        }
      });
    });

    // Global keyboard handler for active modal (Escape + Tab trap)
    document.addEventListener("keydown", function (event) {
      if (!activeModalEl) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeActiveModal();
        return;
      }

      if (event.key === "Tab") {
        var focusables = getFocusableElements(activeModalEl);
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Re-render when header Logout button is clicked
    document.addEventListener("sweetoven:logout", function () {
      closeActiveModal();
      clearFeedback();
      renderAuthGate();
    });

    // Initial load
    updateNavCartCount();
    renderAuthGate();
  });
})();
