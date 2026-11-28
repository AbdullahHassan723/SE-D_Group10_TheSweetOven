(function () {
  "use strict";

  var DRAFT_KEY = "sweetOvenCustomCakeDraft";
  var REQUESTS_KEY = "sweetOvenCustomCakeRequests";
  var MIN_NOTICE_DAYS = 2;

  var data = window.SweetOvenData;
  var shared = window.SweetOvenShared;

  if (!data || !shared) {
    return;
  }

  var opts = data.CUSTOM_CAKE_OPTIONS;

  var form = document.getElementById("customCakeForm");
  var customFeedback = document.getElementById("customFeedback");
  var resetCustomFormBtn = document.getElementById("resetCustomFormBtn");
  var addCustomToCartBtn = document.getElementById("addCustomToCartBtn");

  var occasionSelect = document.getElementById("cakeOccasion");
  var sizeSelect = document.getElementById("cakeSize");
  var spongeSelect = document.getElementById("cakeSponge");
  var fillingSelect = document.getElementById("cakeFilling");
  var frostingSelect = document.getElementById("cakeFrosting");
  var dietarySelect = document.getElementById("cakeDietary");
  var toppingsContainer = document.getElementById("toppingsContainer");

  var cakeMessageInput = document.getElementById("cakeMessage");
  var cakeMessageCount = document.getElementById("cakeMessageCount");
  var cakeMessageError = document.getElementById("cakeMessageError");
  var cakeThemeNotes = document.getElementById("cakeThemeNotes");

  var eventDateInput = document.getElementById("eventDate");
  var eventDateError = document.getElementById("eventDateError");
  var deliveryAreaSelect = document.getElementById("deliveryArea");
  var customerNameInput = document.getElementById("customerName");
  var customerNameError = document.getElementById("customerNameError");
  var customerPhoneInput = document.getElementById("customerPhone");
  var customerPhoneError = document.getElementById("customerPhoneError");
  var customerEmailInput = document.getElementById("customerEmail");
  var customerEmailError = document.getElementById("customerEmailError");

  var previewOccasion = document.getElementById("previewOccasion");
  var previewTitle = document.getElementById("previewTitle");
  var previewInscription = document.getElementById("previewInscription");
  var summarySpecsList = document.getElementById("summarySpecsList");
  var priceBase = document.getElementById("priceBase");
  var priceUpgrades = document.getElementById("priceUpgrades");
  var priceDietary = document.getElementById("priceDietary");
  var priceToppings = document.getElementById("priceToppings");
  var priceDelivery = document.getElementById("priceDelivery");
  var priceTotal = document.getElementById("priceTotal");

  var savedRequestsGrid = document.getElementById("savedRequestsGrid");
  var savedRequestsEmpty = document.getElementById("savedRequestsEmpty");
  var clearAllRequestsBtn = document.getElementById("clearAllRequestsBtn");

  function getMinDateString() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + MIN_NOTICE_DAYS);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function findOptionById(list, id) {
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return list[0];
  }

  function populateSelect(selectEl, items, getLabel, getValue) {
    selectEl.innerHTML = "";
    for (var i = 0; i < items.length; i += 1) {
      var option = document.createElement("option");
      option.value = getValue(items[i]);
      option.textContent = getLabel(items[i]);
      selectEl.appendChild(option);
    }
  }

  function populateFormOptions() {
    populateSelect(
      occasionSelect,
      opts.occasions,
      function (item) { return item; },
      function (item) { return item; }
    );
    populateSelect(
      sizeSelect,
      opts.sizes,
      function (item) { return item.label + " — " + shared.formatPKR(item.basePrice); },
      function (item) { return item.id; }
    );
    populateSelect(
      spongeSelect,
      opts.sponges,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + shared.formatPKR(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      fillingSelect,
      opts.fillings,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + shared.formatPKR(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      frostingSelect,
      opts.frostings,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + shared.formatPKR(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      dietarySelect,
      opts.dietaryOptions,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + shared.formatPKR(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      deliveryAreaSelect,
      opts.deliveryAreas,
      function (item) {
        return item.fee > 0
          ? item.label + " (+ " + shared.formatPKR(item.fee) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );

    renderToppingCheckboxes([]);
    eventDateInput.min = getMinDateString();
  }

  function renderToppingCheckboxes(selectedIds) {
    toppingsContainer.innerHTML = "";
    for (var i = 0; i < opts.toppings.length; i += 1) {
      var topping = opts.toppings[i];
      var inputId = "topping-" + topping.id;
      var checked = selectedIds.indexOf(topping.id) !== -1;

      var col = document.createElement("div");
      col.className = "col-sm-6";

      var label = document.createElement("label");
      label.className = "topping-option" + (checked ? " is-checked" : "");
      label.setAttribute("for", inputId);

      var left = document.createElement("span");
      left.className = "d-flex align-items-center gap-2";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = inputId;
      checkbox.className = "form-check-input mt-0";
      checkbox.value = topping.id;
      checkbox.checked = checked;

      var text = document.createElement("span");
      text.className = "small fw-semibold";
      text.textContent = topping.label;

      left.appendChild(checkbox);
      left.appendChild(text);

      var priceSpan = document.createElement("span");
      priceSpan.className = "topping-price";
      priceSpan.textContent = "+ " + shared.formatPKR(topping.price);

      label.appendChild(left);
      label.appendChild(priceSpan);
      col.appendChild(label);
      toppingsContainer.appendChild(col);
    }
  }

  function getSelectedToppingIds() {
    var checkboxes = toppingsContainer.querySelectorAll("input[type='checkbox']");
    var ids = [];
    for (var i = 0; i < checkboxes.length; i += 1) {
      if (checkboxes[i].checked) {
        ids.push(checkboxes[i].value);
      }
      var parentLabel = checkboxes[i].closest(".topping-option");
      if (parentLabel) {
        parentLabel.classList.toggle("is-checked", checkboxes[i].checked);
      }
    }
    return ids;
  }

  function getCurrentConfig() {
    var size = findOptionById(opts.sizes, sizeSelect.value);
    var sponge = findOptionById(opts.sponges, spongeSelect.value);
    var filling = findOptionById(opts.fillings, fillingSelect.value);
    var frosting = findOptionById(opts.frostings, frostingSelect.value);
    var dietary = findOptionById(opts.dietaryOptions, dietarySelect.value);
    var area = findOptionById(opts.deliveryAreas, deliveryAreaSelect.value);

    var selectedToppingIds = getSelectedToppingIds();
    var selectedToppings = opts.toppings.filter(function (t) {
      return selectedToppingIds.indexOf(t.id) !== -1;
    });

    var basePrice = size.basePrice;
    var upgradePrice = sponge.extraPrice + filling.extraPrice + frosting.extraPrice;
    var dietaryPrice = dietary.extraPrice;
    var toppingsPrice = 0;
    for (var i = 0; i < selectedToppings.length; i += 1) {
      toppingsPrice += selectedToppings[i].price;
    }
    var cakeSubtotal = basePrice + upgradePrice + dietaryPrice + toppingsPrice;
    var deliveryFee = area.fee;
    var total = cakeSubtotal + deliveryFee;

    return {
      occasion: occasionSelect.value || opts.occasions[0],
      size: size,
      sponge: sponge,
      filling: filling,
      frosting: frosting,
      dietary: dietary,
      area: area,
      toppings: selectedToppings,
      toppingIds: selectedToppingIds,
      message: cakeMessageInput.value.trim(),
      themeNotes: cakeThemeNotes.value.trim(),
      eventDate: eventDateInput.value,
      customerName: customerNameInput.value.trim(),
      customerPhone: customerPhoneInput.value.trim(),
      customerEmail: customerEmailInput.value.trim(),
      pricing: {
        basePrice: basePrice,
        upgradePrice: upgradePrice,
        dietaryPrice: dietaryPrice,
        toppingsPrice: toppingsPrice,
        cakeSubtotal: cakeSubtotal,
        deliveryFee: deliveryFee,
        total: total
      }
    };
  }

  function updateSummary() {
    var cfg = getCurrentConfig();

    previewOccasion.textContent = cfg.occasion;
    previewTitle.textContent = cfg.size.label;
    previewInscription.textContent = cfg.message
      ? "\"" + cfg.message + "\""
      : "No cake inscription added";

    cakeMessageCount.textContent = String(cakeMessageInput.value.length);

    var specRows = [
      { label: "Sponge", value: cfg.sponge.label },
      { label: "Filling", value: cfg.filling.label },
      { label: "Frosting", value: cfg.frosting.label },
      { label: "Dietary", value: cfg.dietary.label },
      {
        label: "Toppings",
        value: cfg.toppings.length
          ? cfg.toppings.map(function (t) { return t.label; }).join(", ")
          : "None selected"
      },
      { label: "Event Date", value: cfg.eventDate || "Not selected yet" },
      { label: "Area", value: cfg.area.label }
    ];

    summarySpecsList.innerHTML = "";
    for (var i = 0; i < specRows.length; i += 1) {
      var row = document.createElement("div");
      row.className = "summary-spec-row";
      var dt = document.createElement("dt");
      dt.textContent = specRows[i].label;
      var dd = document.createElement("dd");
      dd.textContent = specRows[i].value;
      row.appendChild(dt);
      row.appendChild(dd);
      summarySpecsList.appendChild(row);
    }

    priceBase.textContent = shared.formatPKR(cfg.pricing.basePrice);
    priceUpgrades.textContent = shared.formatPKR(cfg.pricing.upgradePrice);
    priceDietary.textContent = shared.formatPKR(cfg.pricing.dietaryPrice);
    priceToppings.textContent = shared.formatPKR(cfg.pricing.toppingsPrice);
    priceDelivery.textContent = cfg.pricing.deliveryFee === 0
      ? "Free Pickup"
      : shared.formatPKR(cfg.pricing.deliveryFee);
    priceTotal.textContent = shared.formatPKR(cfg.pricing.total);
  }

  function saveDraft() {
    var draft = {
      occasion: occasionSelect.value,
      sizeId: sizeSelect.value,
      spongeId: spongeSelect.value,
      fillingId: fillingSelect.value,
      frostingId: frostingSelect.value,
      dietaryId: dietarySelect.value,
      toppingIds: getSelectedToppingIds(),
      message: cakeMessageInput.value,
      themeNotes: cakeThemeNotes.value,
      eventDate: eventDateInput.value,
      areaId: deliveryAreaSelect.value,
      customerName: customerNameInput.value,
      customerPhone: customerPhoneInput.value,
      customerEmail: customerEmailInput.value
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (err) {
      // Ignore storage error
    }
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) {
        eventDateInput.value = getMinDateString();
        return;
      }
      var draft = JSON.parse(raw);
      if (!draft || typeof draft !== "object") {
        eventDateInput.value = getMinDateString();
        return;
      }
      if (draft.occasion && opts.occasions.indexOf(draft.occasion) !== -1) {
        occasionSelect.value = draft.occasion;
      }
      if (draft.sizeId) sizeSelect.value = findOptionById(opts.sizes, draft.sizeId).id;
      if (draft.spongeId) spongeSelect.value = findOptionById(opts.sponges, draft.spongeId).id;
      if (draft.fillingId) fillingSelect.value = findOptionById(opts.fillings, draft.fillingId).id;
      if (draft.frostingId) frostingSelect.value = findOptionById(opts.frostings, draft.frostingId).id;
      if (draft.dietaryId) dietarySelect.value = findOptionById(opts.dietaryOptions, draft.dietaryId).id;
      if (draft.areaId) deliveryAreaSelect.value = findOptionById(opts.deliveryAreas, draft.areaId).id;

      renderToppingCheckboxes(Array.isArray(draft.toppingIds) ? draft.toppingIds : []);
      cakeMessageInput.value = typeof draft.message === "string" ? draft.message : "";
      cakeThemeNotes.value = typeof draft.themeNotes === "string" ? draft.themeNotes : "";
      eventDateInput.value = typeof draft.eventDate === "string" && draft.eventDate ? draft.eventDate : getMinDateString();
      customerNameInput.value = typeof draft.customerName === "string" ? draft.customerName : "";
      customerPhoneInput.value = typeof draft.customerPhone === "string" ? draft.customerPhone : "";
      customerEmailInput.value = typeof draft.customerEmail === "string" ? draft.customerEmail : "";
    } catch (err) {
      eventDateInput.value = getMinDateString();
    }
  }

  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message || "";
    inputEl.classList.toggle("is-invalid", Boolean(message));
  }

  function validateForm(requireContactFields) {
    var firstInvalid = null;

    var msgVal = cakeMessageInput.value.trim();
    if (msgVal.length > 50) {
      setFieldError(cakeMessageInput, cakeMessageError, "Cake inscription cannot exceed 50 characters.");
      firstInvalid = firstInvalid || cakeMessageInput;
    } else {
      setFieldError(cakeMessageInput, cakeMessageError, "");
    }

    var dateVal = eventDateInput.value;
    var minDate = getMinDateString();
    if (!dateVal) {
      setFieldError(eventDateInput, eventDateError, "Please choose your event or pickup date.");
      firstInvalid = firstInvalid || eventDateInput;
    } else if (dateVal < minDate) {
      setFieldError(eventDateInput, eventDateError, "Custom cakes require at least 48 hours notice (earliest: " + minDate + ").");
      firstInvalid = firstInvalid || eventDateInput;
    } else {
      setFieldError(eventDateInput, eventDateError, "");
    }

    if (requireContactFields) {
      var nameVal = customerNameInput.value.trim();
      if (nameVal.length < 2) {
        setFieldError(customerNameInput, customerNameError, "Please enter your full name (at least 2 characters).");
        firstInvalid = firstInvalid || customerNameInput;
      } else {
        setFieldError(customerNameInput, customerNameError, "");
      }

      var rawPhone = customerPhoneInput.value.trim().replace(/[\s-]/g, "");
      var phoneValid = /^(\+923\d{9}|03\d{9})$/.test(rawPhone);
      if (!phoneValid) {
        setFieldError(customerPhoneInput, customerPhoneError, "Enter a valid Pakistani mobile number (e.g., 0300-5550192 or +923005550192).");
        firstInvalid = firstInvalid || customerPhoneInput;
      } else {
        setFieldError(customerPhoneInput, customerPhoneError, "");
      }

      var emailVal = customerEmailInput.value.trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFieldError(customerEmailInput, customerEmailError, "Please enter a valid email address or leave this field blank.");
        firstInvalid = firstInvalid || customerEmailInput;
      } else {
        setFieldError(customerEmailInput, customerEmailError, "");
      }
    } else {
      setFieldError(customerNameInput, customerNameError, "");
      setFieldError(customerPhoneInput, customerPhoneError, "");
      setFieldError(customerEmailInput, customerEmailError, "");
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function showFeedback(message, showCartLink, isError) {
    customFeedback.innerHTML = "";
    customFeedback.classList.remove("d-none", "is-error");
    if (isError) {
      customFeedback.classList.add("is-error");
    }

    var textSpan = document.createElement("span");
    textSpan.className = "fw-semibold";
    textSpan.textContent = message;
    customFeedback.appendChild(textSpan);

    if (showCartLink) {
      var link = document.createElement("a");
      link.href = "cart.html";
      link.className = "btn btn-sm btn-bakery";
      link.textContent = "Go to Basket";
      customFeedback.appendChild(link);
    }
    customFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function loadSavedRequests() {
    try {
      var raw = localStorage.getItem(REQUESTS_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveRequests(list) {
    try {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
    } catch (err) {
      // Ignore storage error
    }
  }

  function addCustomCakeConfigToCart(titlePrefix, weightText, priceAmount, cartId) {
    var result = shared.addToCart({
      id: cartId,
      name: titlePrefix,
      category: "Custom Cake",
      weight: weightText,
      price: priceAmount,
      quantity: 1,
      image: "../images/custom-cake.svg",
      alt: "Custom celebration cake designed at The Sweet Oven"
    });
    showFeedback(result.message, result.ok, !result.ok);
  }

  function renderSavedRequests() {
    var requests = loadSavedRequests();
    savedRequestsGrid.innerHTML = "";

    var hasRequests = requests.length > 0;
    savedRequestsEmpty.classList.toggle("d-none", hasRequests);
    clearAllRequestsBtn.classList.toggle("d-none", !hasRequests);

    if (!hasRequests) {
      return;
    }

    for (var i = 0; i < requests.length; i += 1) {
      var req = requests[i];
      var col = document.createElement("div");
      col.className = "col-md-6";

      var card = document.createElement("article");
      card.className = "card p-4 h-100 d-flex flex-column";

      var headerRow = document.createElement("div");
      headerRow.className = "d-flex justify-content-between align-items-start gap-2 mb-2";

      var idEl = document.createElement("strong");
      idEl.textContent = req.requestId + " • " + req.occasion;

      var statusBadge = document.createElement("span");
      statusBadge.className = "badge badge-pink rounded-pill";
      statusBadge.textContent = req.status || "Pending Baker Review";

      headerRow.appendChild(idEl);
      headerRow.appendChild(statusBadge);

      var specsEl = document.createElement("p");
      specsEl.className = "small text-muted-bakery mb-2";
      specsEl.textContent = req.sizeLabel + " | " + req.spongeLabel + " | " + req.fillingLabel + " | " + req.frostingLabel;

      var dateEl = document.createElement("p");
      dateEl.className = "small mb-2";
      dateEl.textContent = "Event Date: " + req.eventDate + " • For " + req.customerName + " (" + req.customerPhone + ")";

      if (req.message) {
        var msgEl = document.createElement("p");
        msgEl.className = "small fst-italic mb-2";
        msgEl.textContent = "Inscription: \"" + req.message + "\"";
        card.appendChild(headerRow);
        card.appendChild(specsEl);
        card.appendChild(dateEl);
        card.appendChild(msgEl);
      } else {
        card.appendChild(headerRow);
        card.appendChild(specsEl);
        card.appendChild(dateEl);
      }

      var footerRow = document.createElement("div");
      footerRow.className = "mt-auto pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2";

      var priceEl = document.createElement("strong");
      priceEl.className = "fs-5";
      priceEl.textContent = shared.formatPKR(req.cakeSubtotal);

      var btnGroup = document.createElement("div");
      btnGroup.className = "d-flex gap-2";

      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn-bakery btn-sm";
      addBtn.setAttribute("data-action", "add-request-cart");
      addBtn.setAttribute("data-request-id", req.requestId);
      addBtn.textContent = "Add to Basket";

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn btn-outline-bakery btn-sm";
      removeBtn.setAttribute("data-action", "remove-request");
      removeBtn.setAttribute("data-request-id", req.requestId);
      removeBtn.textContent = "Remove";

      btnGroup.appendChild(addBtn);
      btnGroup.appendChild(removeBtn);
      footerRow.appendChild(priceEl);
      footerRow.appendChild(btnGroup);
      card.appendChild(footerRow);

      col.appendChild(card);
      savedRequestsGrid.appendChild(col);
    }
  }

  function resetBuilder() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      // Ignore storage error
    }
    populateFormOptions();
    cakeMessageInput.value = "";
    cakeThemeNotes.value = "";
    eventDateInput.value = getMinDateString();
    customerNameInput.value = "";
    customerPhoneInput.value = "";
    customerEmailInput.value = "";

    setFieldError(cakeMessageInput, cakeMessageError, "");
    setFieldError(eventDateInput, eventDateError, "");
    setFieldError(customerNameInput, customerNameError, "");
    setFieldError(customerPhoneInput, customerPhoneError, "");
    setFieldError(customerEmailInput, customerEmailError, "");

    updateSummary();
    showFeedback("Custom cake builder reset to defaults.", false, false);
  }

  form.addEventListener("input", function () {
    updateSummary();
    saveDraft();
  });

  form.addEventListener("change", function () {
    updateSummary();
    saveDraft();
  });

  resetCustomFormBtn.addEventListener("click", resetBuilder);

  addCustomToCartBtn.addEventListener("click", function () {
    if (!validateForm(false)) {
      showFeedback("Please choose a valid event date (at least 48 hours ahead) before adding to basket.", false, true);
      return;
    }
    var cfg = getCurrentConfig();
    var desc = cfg.size.servings + " • " + cfg.sponge.label + " & " + cfg.filling.label + " (Date: " + cfg.eventDate + ")";
    var uniqueId = "custom-cake-" + cfg.size.id + "-" + cfg.sponge.id + "-" + cfg.eventDate;
    addCustomCakeConfigToCart(
      "Custom " + cfg.occasion + " Cake",
      desc,
      cfg.pricing.cakeSubtotal,
      uniqueId
    );
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm(true)) {
      showFeedback("Please fix the highlighted fields before submitting your custom cake request.", false, true);
      return;
    }

    var cfg = getCurrentConfig();
    var randomCode = Math.floor(1000 + Math.random() * 9000);
    var requestRecord = {
      requestId: "TSO-CAKE-" + randomCode,
      createdAt: new Date().toISOString(),
      status: "Pending Baker Review",
      occasion: cfg.occasion,
      sizeLabel: cfg.size.label,
      servings: cfg.size.servings,
      spongeLabel: cfg.sponge.label,
      fillingLabel: cfg.filling.label,
      frostingLabel: cfg.frosting.label,
      dietaryLabel: cfg.dietary.label,
      toppings: cfg.toppings.map(function (t) { return t.label; }),
      message: cfg.message,
      themeNotes: cfg.themeNotes,
      eventDate: cfg.eventDate,
      areaLabel: cfg.area.label,
      customerName: cfg.customerName,
      customerPhone: cfg.customerPhone,
      customerEmail: cfg.customerEmail,
      cakeSubtotal: cfg.pricing.cakeSubtotal,
      deliveryFee: cfg.pricing.deliveryFee,
      total: cfg.pricing.total
    };

    var existing = loadSavedRequests();
    existing.unshift(requestRecord);
    saveRequests(existing);

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      // Ignore storage error
    }

    renderSavedRequests();
    showFeedback(
      "Request " + requestRecord.requestId + " saved! Our baker will confirm your design on WhatsApp (" + cfg.customerPhone + ").",
      false,
      false
    );
  });

  savedRequestsGrid.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-action]");
    if (!btn) {
      return;
    }
    var action = btn.getAttribute("data-action");
    var reqId = btn.getAttribute("data-request-id");
    var requests = loadSavedRequests();

    if (action === "remove-request") {
      var updated = requests.filter(function (r) {
        return r.requestId !== reqId;
      });
      saveRequests(updated);
      renderSavedRequests();
      showFeedback("Removed custom cake request " + reqId + ".", false, false);
      return;
    }

    if (action === "add-request-cart") {
      for (var i = 0; i < requests.length; i += 1) {
        if (requests[i].requestId === reqId) {
          var req = requests[i];
          var summary = req.sizeLabel + " • " + req.spongeLabel + " (Date: " + req.eventDate + ")";
          addCustomCakeConfigToCart(
            "Custom Cake (" + req.requestId + ")",
            summary,
            req.cakeSubtotal,
            "custom-" + req.requestId.toLowerCase()
          );
          break;
        }
      }
    }
  });

  clearAllRequestsBtn.addEventListener("click", function () {
    saveRequests([]);
    renderSavedRequests();
    showFeedback("Cleared all saved custom cake requests.", false, false);
  });

  populateFormOptions();
  loadDraft();
  updateSummary();
  renderSavedRequests();
})();
