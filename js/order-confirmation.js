(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var LAST_ORDER_KEY = "sweetOvenLastOrder";
  var ALL_ORDERS_KEY = "sweetOvenOrders";

  var bakingStages = [
    {
      step: 1,
      title: "Order Confirmed",
      detail: "We received your order and scheduled your baking slot.",
      done: true
    },
    {
      step: 2,
      title: "Freshly Baking",
      detail: "Small-batch mixing & baking begins before dispatch.",
      done: true
    },
    {
      step: 3,
      title: "Frosting & Quality Check",
      detail: "Packed in insulated ribbon-sealed bakery boxes.",
      done: false
    },
    {
      step: 4,
      title: "Out for Delivery",
      detail: "Dispatched chilled to your doorstep or ready at F-8/3.",
      done: false
    }
  ];

  var navToggle = document.getElementById("navToggle");
  var primaryMenu = document.getElementById("primaryMenu");
  var navCartCount = document.getElementById("navCartCount");

  var orderLookupForm = document.getElementById("orderLookupForm");
  var orderLookupInput = document.getElementById("orderLookupInput");
  var lookupFeedback = document.getElementById("lookupFeedback");

  var noOrderState = document.getElementById("noOrderState");
  var orderConfirmationContent = document.getElementById("orderConfirmationContent");

  var orderStatusBadge = document.getElementById("orderStatusBadge");
  var customerGreetingName = document.getElementById("customerGreetingName");
  var orderIdDisplay = document.getElementById("orderIdDisplay");
  var orderDateDisplay = document.getElementById("orderDateDisplay");
  var copyOrderIdBtn = document.getElementById("copyOrderIdBtn");
  var copyFeedback = document.getElementById("copyFeedback");
  var printReceiptBtn = document.getElementById("printReceiptBtn");

  var bakingTimeline = document.getElementById("bakingTimeline");
  var orderedItemsList = document.getElementById("orderedItemsList");

  var confirmItemCount = document.getElementById("confirmItemCount");
  var confirmSubtotal = document.getElementById("confirmSubtotal");
  var confirmDiscountRow = document.getElementById("confirmDiscountRow");
  var confirmPromoCode = document.getElementById("confirmPromoCode");
  var confirmDiscount = document.getElementById("confirmDiscount");
  var confirmDeliveryFee = document.getElementById("confirmDeliveryFee");
  var confirmTotal = document.getElementById("confirmTotal");
  var confirmPaymentMethod = document.getElementById("confirmPaymentMethod");
  var confirmPaymentRef = document.getElementById("confirmPaymentRef");

  var confirmCustomerName = document.getElementById("confirmCustomerName");
  var confirmCustomerContact = document.getElementById("confirmCustomerContact");
  var confirmSchedule = document.getElementById("confirmSchedule");
  var confirmAddress = document.getElementById("confirmAddress");
  var confirmNotesBlock = document.getElementById("confirmNotesBlock");
  var confirmNotes = document.getElementById("confirmNotes");

  var currentOrder = null;

  function formatPKR(amount) {
    return "PKR " + Math.round(Number(amount) || 0).toLocaleString("en-PK");
  }

  function formatOrderDate(isoString) {
    try {
      var dt = new Date(isoString);
      return dt.toLocaleString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch (err) {
      return isoString || "";
    }
  }

  function updateNavCartCount() {
    try {
      var raw = localStorage.getItem(CART_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      var count = 0;
      if (Array.isArray(parsed)) {
        for (var i = 0; i < parsed.length; i += 1) {
          count += Number(parsed[i].quantity) || 0;
        }
      }
      navCartCount.textContent = String(count);
    } catch (err) {
      navCartCount.textContent = "0";
    }
  }

  function loadAllOrders() {
    try {
      var raw = localStorage.getItem(ALL_ORDERS_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function loadLastOrder() {
    try {
      var raw = localStorage.getItem(LAST_ORDER_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      var all = loadAllOrders();
      return all.length > 0 ? all[0] : null;
    } catch (err) {
      return null;
    }
  }

  function renderTimeline(isPickup) {
    bakingTimeline.innerHTML = "";
    for (var i = 0; i < bakingStages.length; i += 1) {
      var stage = bakingStages[i];
      var li = document.createElement("li");
      li.className = "timeline-step" + (stage.done ? " is-done" : "");

      var badge = document.createElement("span");
      badge.className = "timeline-badge";
      badge.textContent = String(stage.step);

      var title = document.createElement("h3");
      title.className = "h6 fw-bold mb-1";
      title.textContent = stage.step === 4 && isPickup ? "Ready for Pickup" : stage.title;

      var detail = document.createElement("p");
      detail.className = "small text-muted-brown mb-0";
      detail.textContent = stage.detail;

      li.appendChild(badge);
      li.appendChild(title);
      li.appendChild(detail);
      bakingTimeline.appendChild(li);
    }
  }

  function renderOrder(order) {
    if (!order || !order.orderId || !Array.isArray(order.items)) {
      currentOrder = null;
      noOrderState.classList.remove("d-none");
      orderConfirmationContent.classList.add("d-none");
      return;
    }

    currentOrder = order;
    noOrderState.classList.add("d-none");
    orderConfirmationContent.classList.remove("d-none");

    orderStatusBadge.textContent = order.status || "Confirmed — Baking Soon";
    customerGreetingName.textContent = (order.customer && order.customer.fullName) ? order.customer.fullName : "Valued Customer";
    orderIdDisplay.textContent = order.orderId;
    orderDateDisplay.textContent = formatOrderDate(order.createdAt);

    renderTimeline(Boolean(order.delivery && order.delivery.isPickup));

    orderedItemsList.innerHTML = "";
    for (var i = 0; i < order.items.length; i += 1) {
      var item = order.items[i];
      var li = document.createElement("li");
      li.className = "ordered-item";

      var left = document.createElement("div");
      left.className = "ordered-item-left";

      var img = document.createElement("img");
      img.className = "ordered-item-img";
      img.src = item.image || "../images/chocolate-fudge-cake.svg";
      img.alt = item.alt || item.name;
      img.width = 72;
      img.height = 58;

      var info = document.createElement("div");
      var title = document.createElement("h3");
      title.className = "h6 fw-bold mb-1";
      title.textContent = item.name;

      var meta = document.createElement("div");
      meta.className = "small text-muted-brown";
      meta.textContent = (item.weight ? item.weight + " • " : "") + "Qty: " + item.quantity + " × " + formatPKR(item.price);

      info.appendChild(title);
      info.appendChild(meta);
      left.appendChild(img);
      left.appendChild(info);

      var lineTotal = document.createElement("div");
      lineTotal.className = "fw-bold text-nowrap";
      lineTotal.textContent = formatPKR(Number(item.price) * Number(item.quantity));

      li.appendChild(left);
      li.appendChild(lineTotal);
      orderedItemsList.appendChild(li);
    }

    var pricing = order.pricing || {};
    confirmItemCount.textContent = String(pricing.itemCount || order.items.length);
    confirmSubtotal.textContent = formatPKR(pricing.subtotal || 0);

    if (Number(pricing.discount) > 0) {
      confirmDiscountRow.classList.remove("d-none");
      confirmPromoCode.textContent = order.promoCode || "SWEET10";
      confirmDiscount.textContent = "- " + formatPKR(pricing.discount);
    } else {
      confirmDiscountRow.classList.add("d-none");
    }

    confirmDeliveryFee.textContent = Number(pricing.deliveryFee) === 0 ? "Free" : formatPKR(pricing.deliveryFee);
    confirmTotal.textContent = formatPKR(pricing.total || 0);

    confirmPaymentMethod.textContent = (order.payment && order.payment.methodLabel) || "Cash on Delivery";
    confirmPaymentRef.textContent = (order.payment && order.payment.reference) || "Pay on delivery";

    confirmCustomerName.textContent = (order.customer && order.customer.fullName) || "";
    confirmCustomerContact.textContent =
      ((order.customer && order.customer.phone) || "") +
      " • " +
      ((order.customer && order.customer.email) || "");

    if (order.delivery) {
      confirmSchedule.textContent =
        order.delivery.areaName + " • " + order.delivery.date + " (" + order.delivery.slotLabel + ")";
      confirmAddress.textContent = order.delivery.address;
    }

    if (order.notes) {
      confirmNotesBlock.classList.remove("d-none");
      confirmNotes.textContent = order.notes;
    } else {
      confirmNotesBlock.classList.add("d-none");
    }
  }

  function showLookupFeedback(message, isError) {
    lookupFeedback.textContent = message;
    lookupFeedback.classList.remove("d-none", "text-danger", "text-success");
    lookupFeedback.classList.add(isError ? "text-danger" : "text-success", "fw-semibold");
  }

  navToggle.addEventListener("click", function () {
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryMenu.classList.toggle("is-open", !expanded);
  });

  orderLookupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = orderLookupInput.value.trim().toUpperCase();
    if (!query) {
      showLookupFeedback("Please enter an Order ID such as TSO-2026-4821.", true);
      return;
    }
    var orders = loadAllOrders();
    var match = null;
    for (var i = 0; i < orders.length; i += 1) {
      if (String(orders[i].orderId || "").toUpperCase() === query) {
        match = orders[i];
        break;
      }
    }
    if (!match) {
      showLookupFeedback("No saved order found matching '" + query + "'. Check the Order ID or place a new order.", true);
      return;
    }
    showLookupFeedback("Loaded saved receipt for order " + match.orderId + ".", false);
    renderOrder(match);
  });

  copyOrderIdBtn.addEventListener("click", function () {
    if (!currentOrder) {
      return;
    }
    var text = currentOrder.orderId;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyFeedback.textContent = "Copied " + text + " to clipboard.";
        copyFeedback.classList.remove("d-none");
      }).catch(function () {
        copyFeedback.textContent = "Order ID: " + text;
        copyFeedback.classList.remove("d-none");
      });
    } else {
      copyFeedback.textContent = "Order ID: " + text;
      copyFeedback.classList.remove("d-none");
    }
  });

  printReceiptBtn.addEventListener("click", function () {
    window.print();
  });

  updateNavCartCount();
  renderOrder(loadLastOrder());
})();
