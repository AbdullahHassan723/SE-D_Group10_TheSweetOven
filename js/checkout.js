(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var PROMO_STORAGE_KEY = "sweetOvenPromo";
  var DRAFT_STORAGE_KEY = "sweetOvenCheckoutDraft";
  var LAST_ORDER_KEY = "sweetOvenLastOrder";
  var ALL_ORDERS_KEY = "sweetOvenOrders";

  var deliveryAreas = [
    {
      id: "pickup-f8",
      name: "Self-Pickup — F-8/3 Home Kitchen",
      city: "Islamabad",
      fee: 0,
      eta: "Ready at selected slot (No delivery charge)",
      isPickup: true
    },
    {
      id: "isb-f6-f8",
      name: "Sectors F-6, F-7 & F-8",
      city: "Islamabad",
      fee: 200,
      eta: "35-45 mins rider delivery",
      isPickup: false
    },
    {
      id: "isb-f10-f11",
      name: "Sectors F-10 & F-11",
      city: "Islamabad",
      fee: 250,
      eta: "45-60 mins rider delivery",
      isPickup: false
    },
    {
      id: "isb-g9-g11",
      name: "Sectors G-9, G-10 & G-11",
      city: "Islamabad",
      fee: 250,
      eta: "45-60 mins rider delivery",
      isPickup: false
    },
    {
      id: "isb-e11-d12",
      name: "Sectors E-11 & D-12",
      city: "Islamabad",
      fee: 300,
      eta: "50-70 mins rider delivery",
      isPickup: false
    },
    {
      id: "rwp-chaklala",
      name: "Chaklala Scheme III & Saddar",
      city: "Rawalpindi",
      fee: 350,
      eta: "60-75 mins chilled van delivery",
      isPickup: false
    },
    {
      id: "isb-dha-bahria",
      name: "DHA Islamabad & Bahria Town (Phases 1-7)",
      city: "Islamabad / Rawalpindi",
      fee: 450,
      eta: "75-90 mins chilled van delivery",
      isPickup: false
    }
  ];

  var deliverySlots = [
    { id: "morning", label: "Morning Batch (10:00 AM - 1:00 PM)" },
    { id: "afternoon", label: "Afternoon Tea (2:00 PM - 5:00 PM)" },
    { id: "evening", label: "Evening Dessert (6:00 PM - 9:00 PM)" }
  ];

  var paymentMethods = [
    {
      id: "cod",
      label: "Cash on Delivery (COD)",
      description: "Pay in cash when your fresh bakery box arrives.",
      requiresRef: false,
      accountInfo: ""
    },
    {
      id: "jazzcash",
      label: "JazzCash / Easypaisa Mobile Wallet",
      description: "Send instant payment before dispatch.",
      requiresRef: true,
      accountInfo: "Transfer to 0300-5550192 (Title: Aymen Niaz — The Sweet Oven) and enter your TID below."
    },
    {
      id: "bank",
      label: "Bank Transfer (IBFT / Raast)",
      description: "Direct online transfer to our bakery account.",
      requiresRef: true,
      accountInfo: "Meezan Bank IBAN: PK36MEZN0002810104591203 (Title: The Sweet Oven) — enter reference below."
    }
  ];

  var cartItems = loadCart();
  var activePromo = loadPromo();

  var navToggle = document.getElementById("navToggle");
  var primaryMenu = document.getElementById("primaryMenu");
  var navCartCount = document.getElementById("navCartCount");

  var emptyCheckoutAlert = document.getElementById("emptyCheckoutAlert");
  var formAlert = document.getElementById("formAlert");
  var checkoutForm = document.getElementById("checkoutForm");
  var placeOrderBtn = document.getElementById("placeOrderBtn");

  var fullNameInput = document.getElementById("fullName");
  var phoneInput = document.getElementById("customerPhone");
  var emailInput = document.getElementById("customerEmail");
  var deliveryAreaSelect = document.getElementById("deliveryArea");
  var areaEtaHint = document.getElementById("areaEtaHint");
  var addressGroup = document.getElementById("addressGroup");
  var streetAddressInput = document.getElementById("streetAddress");
  var deliveryDateInput = document.getElementById("deliveryDate");
  var deliverySlotSelect = document.getElementById("deliverySlot");
  var paymentMethodsContainer = document.getElementById("paymentMethodsContainer");
  var paymentMethodFeedback = document.getElementById("paymentMethodFeedback");
  var paymentInstructionsBox = document.getElementById("paymentInstructionsBox");
  var paymentAccountText = document.getElementById("paymentAccountText");
  var txnRefInput = document.getElementById("txnRef");
  var orderNotesInput = document.getElementById("orderNotes");
  var notesCounter = document.getElementById("notesCounter");
  var termsCheck = document.getElementById("termsCheck");

  var checkoutItemsList = document.getElementById("checkoutItemsList");
  var checkoutItemCount = document.getElementById("checkoutItemCount");
  var checkoutSubtotal = document.getElementById("checkoutSubtotal");
  var checkoutDiscountRow = document.getElementById("checkoutDiscountRow");
  var checkoutPromoCode = document.getElementById("checkoutPromoCode");
  var checkoutDiscount = document.getElementById("checkoutDiscount");
  var checkoutDeliveryFee = document.getElementById("checkoutDeliveryFee");
  var checkoutGrandTotal = document.getElementById("checkoutGrandTotal");

  function formatPKR(amount) {
    return "PKR " + Math.round(amount).toLocaleString("en-PK");
  }

  function getTodayISO() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(function (item) {
        return item && item.id && item.name && Number(item.price) > 0 && Number(item.quantity) >= 1;
      });
    } catch (err) {
      return [];
    }
  }

  function loadPromo() {
    try {
      var code = (localStorage.getItem(PROMO_STORAGE_KEY) || "").trim().toUpperCase();
      return code === "SWEET10" ? "SWEET10" : "";
    } catch (err) {
      return "";
    }
  }

  function findAreaById(areaId) {
    for (var i = 0; i < deliveryAreas.length; i += 1) {
      if (deliveryAreas[i].id === areaId) {
        return deliveryAreas[i];
      }
    }
    return null;
  }

  function findPaymentById(methodId) {
    for (var i = 0; i < paymentMethods.length; i += 1) {
      if (paymentMethods[i].id === methodId) {
        return paymentMethods[i];
      }
    }
    return null;
  }

  function getSelectedPaymentId() {
    var checked = document.querySelector("input[name='paymentMethod']:checked");
    return checked ? checked.value : "";
  }

  function populateSelectOptions() {
    for (var i = 0; i < deliveryAreas.length; i += 1) {
      var area = deliveryAreas[i];
      var opt = document.createElement("option");
      opt.value = area.id;
      opt.textContent = area.name + " (" + (area.fee === 0 ? "Free" : formatPKR(area.fee)) + ")";
      deliveryAreaSelect.appendChild(opt);
    }

    for (var j = 0; j < deliverySlots.length; j += 1) {
      var slot = deliverySlots[j];
      var slotOpt = document.createElement("option");
      slotOpt.value = slot.id;
      slotOpt.textContent = slot.label;
      deliverySlotSelect.appendChild(slotOpt);
    }
  }

  function renderPaymentMethods() {
    paymentMethodsContainer.innerHTML = "";
    for (var i = 0; i < paymentMethods.length; i += 1) {
      var method = paymentMethods[i];
      var wrapper = document.createElement("label");
      wrapper.className = "payment-option-card";
      wrapper.setAttribute("for", "pay-" + method.id);

      var row = document.createElement("div");
      row.className = "form-check d-flex align-items-start gap-2 mb-0";

      var radio = document.createElement("input");
      radio.type = "radio";
      radio.className = "form-check-input mt-1";
      radio.name = "paymentMethod";
      radio.id = "pay-" + method.id;
      radio.value = method.id;
      if (i === 0) {
        radio.checked = true;
        wrapper.classList.add("is-selected");
      }

      var textBlock = document.createElement("span");
      textBlock.className = "d-block";

      var title = document.createElement("strong");
      title.className = "d-block";
      title.textContent = method.label;

      var desc = document.createElement("span");
      desc.className = "small text-muted-brown";
      desc.textContent = method.description;

      textBlock.appendChild(title);
      textBlock.appendChild(desc);

      row.appendChild(radio);
      row.appendChild(textBlock);
      wrapper.appendChild(row);
      paymentMethodsContainer.appendChild(wrapper);
    }
  }

  function calculateSummary() {
    var itemCount = 0;
    var subtotal = 0;
    for (var i = 0; i < cartItems.length; i += 1) {
      itemCount += Number(cartItems[i].quantity);
      subtotal += Number(cartItems[i].price) * Number(cartItems[i].quantity);
    }
    var discount = activePromo === "SWEET10" && subtotal > 0 ? Math.round(subtotal * 0.10) : 0;
    var selectedArea = findAreaById(deliveryAreaSelect.value);
    var deliveryFee = selectedArea ? selectedArea.fee : 0;
    var grandTotal = Math.max(0, subtotal - discount + (cartItems.length > 0 ? deliveryFee : 0));

    return {
      itemCount: itemCount,
      subtotal: subtotal,
      discount: discount,
      selectedArea: selectedArea,
      deliveryFee: deliveryFee,
      grandTotal: grandTotal
    };
  }

  function renderOrderSummary() {
    var summary = calculateSummary();
    navCartCount.textContent = String(summary.itemCount);
    checkoutItemsList.innerHTML = "";

    if (cartItems.length === 0) {
      emptyCheckoutAlert.classList.remove("d-none");
      placeOrderBtn.disabled = true;
      var emptyLi = document.createElement("li");
      emptyLi.className = "text-muted-brown small py-2";
      emptyLi.textContent = "No bakery items in basket.";
      checkoutItemsList.appendChild(emptyLi);
    } else {
      emptyCheckoutAlert.classList.add("d-none");
      placeOrderBtn.disabled = false;

      for (var i = 0; i < cartItems.length; i += 1) {
        var item = cartItems[i];
        var li = document.createElement("li");
        li.className = "checkout-item";

        var left = document.createElement("div");
        left.className = "checkout-item-left";

        var img = document.createElement("img");
        img.className = "checkout-item-img";
        img.src = item.image || "../images/chocolate-fudge-cake.svg";
        img.alt = item.alt || item.name;
        img.width = 56;
        img.height = 46;

        var info = document.createElement("div");
        var name = document.createElement("div");
        name.className = "fw-semibold small";
        name.textContent = item.name;

        var qtyText = document.createElement("div");
        qtyText.className = "text-muted-brown small";
        qtyText.textContent = "Qty: " + item.quantity + " × " + formatPKR(item.price);

        info.appendChild(name);
        info.appendChild(qtyText);
        left.appendChild(img);
        left.appendChild(info);

        var right = document.createElement("div");
        right.className = "fw-bold small text-nowrap";
        right.textContent = formatPKR(item.price * item.quantity);

        li.appendChild(left);
        li.appendChild(right);
        checkoutItemsList.appendChild(li);
      }
    }

    checkoutItemCount.textContent = String(summary.itemCount);
    checkoutSubtotal.textContent = formatPKR(summary.subtotal);

    if (summary.discount > 0) {
      checkoutDiscountRow.classList.remove("d-none");
      checkoutPromoCode.textContent = activePromo;
      checkoutDiscount.textContent = "- " + formatPKR(summary.discount);
    } else {
      checkoutDiscountRow.classList.add("d-none");
    }

    if (summary.selectedArea) {
      checkoutDeliveryFee.textContent = summary.deliveryFee === 0 ? "Free (Pickup)" : formatPKR(summary.deliveryFee);
    } else {
      checkoutDeliveryFee.textContent = "Select area";
    }

    checkoutGrandTotal.textContent = formatPKR(summary.grandTotal);
  }

  function setFieldValidity(inputEl, feedbackEl, isValid, message) {
    inputEl.classList.remove("is-valid", "is-invalid");
    if (isValid) {
      inputEl.classList.add("is-valid");
      feedbackEl.textContent = "";
    } else {
      inputEl.classList.add("is-invalid");
      feedbackEl.textContent = message;
    }
    return isValid;
  }

  function validateFullName() {
    var val = fullNameInput.value.trim();
    var fb = document.getElementById("fullNameFeedback");
    if (!val) {
      return setFieldValidity(fullNameInput, fb, false, "Please enter your full name.");
    }
    if (val.length < 3 || !/^[A-Za-z\s'.-]+$/.test(val)) {
      return setFieldValidity(fullNameInput, fb, false, "Enter a valid name (letters and spaces, at least 3 characters).");
    }
    return setFieldValidity(fullNameInput, fb, true, "");
  }

  function validatePhone() {
    var val = phoneInput.value.trim().replace(/\s+/g, "");
    var fb = document.getElementById("customerPhoneFeedback");
    var pkMobilePattern = /^(?:\+92|0)3\d{2}-?\d{7}$/;
    if (!val) {
      return setFieldValidity(phoneInput, fb, false, "Please enter a Pakistani mobile number.");
    }
    if (!pkMobilePattern.test(val)) {
      return setFieldValidity(phoneInput, fb, false, "Use a valid format such as 0300-1234567 or +923001234567.");
    }
    return setFieldValidity(phoneInput, fb, true, "");
  }

  function validateEmail() {
    var val = emailInput.value.trim();
    var fb = document.getElementById("customerEmailFeedback");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!val) {
      return setFieldValidity(emailInput, fb, false, "Please enter your email address for order updates.");
    }
    if (!emailPattern.test(val)) {
      return setFieldValidity(emailInput, fb, false, "Please enter a valid email address (e.g. name@example.com).");
    }
    return setFieldValidity(emailInput, fb, true, "");
  }

  function validateArea() {
    var area = findAreaById(deliveryAreaSelect.value);
    var fb = document.getElementById("deliveryAreaFeedback");
    if (!area) {
      areaEtaHint.textContent = "Select an area to see delivery fee and estimated rider window.";
      return setFieldValidity(deliveryAreaSelect, fb, false, "Please select a delivery area or kitchen pickup.");
    }
    areaEtaHint.textContent = area.city + " • " + area.eta;
    if (area.isPickup) {
      addressGroup.classList.add("d-none");
      streetAddressInput.classList.remove("is-invalid", "is-valid");
    } else {
      addressGroup.classList.remove("d-none");
    }
    return setFieldValidity(deliveryAreaSelect, fb, true, "");
  }

  function validateAddress() {
    var area = findAreaById(deliveryAreaSelect.value);
    var fb = document.getElementById("streetAddressFeedback");
    if (area && area.isPickup) {
      streetAddressInput.classList.remove("is-invalid", "is-valid");
      fb.textContent = "";
      return true;
    }
    var val = streetAddressInput.value.trim();
    if (!val) {
      return setFieldValidity(streetAddressInput, fb, false, "Please enter your house number, street, and nearest landmark.");
    }
    if (val.length < 10) {
      return setFieldValidity(streetAddressInput, fb, false, "Address is too short — include house no, street, and sector.");
    }
    return setFieldValidity(streetAddressInput, fb, true, "");
  }

  function validateDate() {
    var val = deliveryDateInput.value;
    var fb = document.getElementById("deliveryDateFeedback");
    var today = getTodayISO();
    if (!val) {
      return setFieldValidity(deliveryDateInput, fb, false, "Please choose a delivery or pickup date.");
    }
    if (val < today) {
      return setFieldValidity(deliveryDateInput, fb, false, "Delivery date cannot be in the past.");
    }
    return setFieldValidity(deliveryDateInput, fb, true, "");
  }

  function validateSlot() {
    var val = deliverySlotSelect.value;
    var fb = document.getElementById("deliverySlotFeedback");
    if (!val) {
      return setFieldValidity(deliverySlotSelect, fb, false, "Please choose a delivery time slot.");
    }
    return setFieldValidity(deliverySlotSelect, fb, true, "");
  }

  function updatePaymentUI() {
    var methodId = getSelectedPaymentId();
    var method = findPaymentById(methodId);
    var cards = paymentMethodsContainer.querySelectorAll(".payment-option-card");
    for (var i = 0; i < cards.length; i += 1) {
      var radio = cards[i].querySelector("input[type='radio']");
      cards[i].classList.toggle("is-selected", Boolean(radio && radio.checked));
    }

    if (method && method.requiresRef) {
      paymentInstructionsBox.classList.remove("d-none");
      paymentAccountText.textContent = method.accountInfo;
    } else {
      paymentInstructionsBox.classList.add("d-none");
      txnRefInput.classList.remove("is-invalid", "is-valid");
      document.getElementById("txnRefFeedback").textContent = "";
    }
  }

  function validatePayment() {
    var methodId = getSelectedPaymentId();
    var method = findPaymentById(methodId);
    if (!method) {
      paymentMethodFeedback.textContent = "Please choose a payment method.";
      paymentMethodFeedback.classList.remove("d-none");
      return false;
    }
    paymentMethodFeedback.classList.add("d-none");
    if (!method.requiresRef) {
      return true;
    }
    var ref = txnRefInput.value.trim();
    var fb = document.getElementById("txnRefFeedback");
    if (!ref || ref.length < 5 || !/^[A-Za-z0-9-]+$/.test(ref)) {
      return setFieldValidity(txnRefInput, fb, false, "Enter a valid transaction reference ID (at least 5 letters or digits).");
    }
    return setFieldValidity(txnRefInput, fb, true, "");
  }

  function validateNotes() {
    var val = orderNotesInput.value;
    var fb = document.getElementById("orderNotesFeedback");
    notesCounter.textContent = val.length + " / 200";
    if (val.length > 200) {
      return setFieldValidity(orderNotesInput, fb, false, "Special notes cannot exceed 200 characters.");
    }
    orderNotesInput.classList.remove("is-invalid");
    fb.textContent = "";
    return true;
  }

  function validateTerms() {
    var fb = document.getElementById("termsCheckFeedback");
    if (!termsCheck.checked) {
      termsCheck.classList.add("is-invalid");
      fb.textContent = "Please confirm your order details before placing your order.";
      return false;
    }
    termsCheck.classList.remove("is-invalid");
    termsCheck.classList.add("is-valid");
    fb.textContent = "";
    return true;
  }

  function saveDraft() {
    try {
      var draft = {
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        areaId: deliveryAreaSelect.value,
        address: streetAddressInput.value,
        deliveryDate: deliveryDateInput.value,
        deliverySlot: deliverySlotSelect.value,
        paymentMethod: getSelectedPaymentId(),
        notes: orderNotesInput.value
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (err) {
      // Ignore draft storage failures
    }
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) {
        return;
      }
      var draft = JSON.parse(raw);
      if (draft.fullName) fullNameInput.value = draft.fullName;
      if (draft.phone) phoneInput.value = draft.phone;
      if (draft.email) emailInput.value = draft.email;
      if (draft.areaId) deliveryAreaSelect.value = draft.areaId;
      if (draft.address) streetAddressInput.value = draft.address;
      if (draft.deliveryDate && draft.deliveryDate >= getTodayISO()) {
        deliveryDateInput.value = draft.deliveryDate;
      }
      if (draft.deliverySlot) deliverySlotSelect.value = draft.deliverySlot;
      if (draft.paymentMethod) {
        var radio = document.querySelector("input[name='paymentMethod'][value='" + draft.paymentMethod + "']");
        if (radio) radio.checked = true;
      }
      if (draft.notes) orderNotesInput.value = draft.notes;
    } catch (err) {
      // Ignore malformed draft
    }
  }

  function generateOrderId() {
    var randomFour = Math.floor(1000 + Math.random() * 9000);
    var year = new Date().getFullYear();
    return "TSO-" + year + "-" + randomFour;
  }

  function findSlotLabel(slotId) {
    for (var i = 0; i < deliverySlots.length; i += 1) {
      if (deliverySlots[i].id === slotId) {
        return deliverySlots[i].label;
      }
    }
    return slotId;
  }

  // Event listeners
  navToggle.addEventListener("click", function () {
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    primaryMenu.classList.toggle("is-open", !expanded);
  });

  fullNameInput.addEventListener("input", function () { validateFullName(); saveDraft(); });
  phoneInput.addEventListener("input", function () { validatePhone(); saveDraft(); });
  emailInput.addEventListener("input", function () { validateEmail(); saveDraft(); });
  streetAddressInput.addEventListener("input", function () { validateAddress(); saveDraft(); });
  deliveryDateInput.addEventListener("change", function () { validateDate(); saveDraft(); });
  deliverySlotSelect.addEventListener("change", function () { validateSlot(); saveDraft(); });
  orderNotesInput.addEventListener("input", function () { validateNotes(); saveDraft(); });
  txnRefInput.addEventListener("input", validatePayment);
  termsCheck.addEventListener("change", validateTerms);

  deliveryAreaSelect.addEventListener("change", function () {
    validateArea();
    if (streetAddressInput.value.trim()) {
      validateAddress();
    }
    renderOrderSummary();
    saveDraft();
  });

  paymentMethodsContainer.addEventListener("change", function () {
    updatePaymentUI();
    saveDraft();
  });

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (cartItems.length === 0) {
      formAlert.textContent = "Your basket is empty. Add bakery items before placing an order.";
      formAlert.classList.remove("d-none");
      return;
    }

    var checks = [
      { ok: validateFullName(), el: fullNameInput },
      { ok: validatePhone(), el: phoneInput },
      { ok: validateEmail(), el: emailInput },
      { ok: validateArea(), el: deliveryAreaSelect },
      { ok: validateAddress(), el: streetAddressInput },
      { ok: validateDate(), el: deliveryDateInput },
      { ok: validateSlot(), el: deliverySlotSelect },
      { ok: validatePayment(), el: txnRefInput },
      { ok: validateNotes(), el: orderNotesInput },
      { ok: validateTerms(), el: termsCheck }
    ];

    var firstInvalid = null;
    for (var i = 0; i < checks.length; i += 1) {
      if (!checks[i].ok && !firstInvalid) {
        firstInvalid = checks[i].el;
      }
    }

    if (firstInvalid) {
      formAlert.textContent = "Please fix the highlighted fields before placing your bakery order.";
      formAlert.classList.remove("d-none");
      firstInvalid.focus();
      return;
    }

    formAlert.classList.add("d-none");

    var summary = calculateSummary();
    var selectedArea = summary.selectedArea;
    var selectedPayment = findPaymentById(getSelectedPaymentId());

    var orderRecord = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: "Confirmed — Baking Soon",
      customer: {
        fullName: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim()
      },
      delivery: {
        areaId: selectedArea.id,
        areaName: selectedArea.name,
        city: selectedArea.city,
        eta: selectedArea.eta,
        isPickup: selectedArea.isPickup,
        address: selectedArea.isPickup
          ? "Pickup at The Sweet Oven Kitchen, Street 14, Sector F-8/3, Islamabad"
          : streetAddressInput.value.trim(),
        date: deliveryDateInput.value,
        slotLabel: findSlotLabel(deliverySlotSelect.value)
      },
      payment: {
        methodId: selectedPayment.id,
        methodLabel: selectedPayment.label,
        reference: selectedPayment.requiresRef ? txnRefInput.value.trim() : "Pay on delivery"
      },
      notes: orderNotesInput.value.trim(),
      promoCode: activePromo,
      items: cartItems.slice(),
      pricing: {
        itemCount: summary.itemCount,
        subtotal: summary.subtotal,
        discount: summary.discount,
        deliveryFee: summary.deliveryFee,
        total: summary.grandTotal
      }
    };

    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(orderRecord));
      var existingRaw = localStorage.getItem(ALL_ORDERS_KEY);
      var existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
      if (!Array.isArray(existingOrders)) {
        existingOrders = [];
      }
      existingOrders.unshift(orderRecord);
      localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(existingOrders.slice(0, 20)));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem(PROMO_STORAGE_KEY);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      formAlert.textContent = "Could not save your order to browser storage. Please enable localStorage and try again.";
      formAlert.classList.remove("d-none");
      return;
    }

    window.location.href = "order-confirmation.html";
  });

  // Init
  populateSelectOptions();
  renderPaymentMethods();
  deliveryDateInput.min = getTodayISO();
  deliveryDateInput.value = getTodayISO();
  loadDraft();
  if (deliveryAreaSelect.value) {
    validateArea();
  }
  updatePaymentUI();
  validateNotes();
  renderOrderSummary();
})();
