(function () {
  "use strict";

  var DRAFT_KEY = "sweetOvenCustomCakeDraft";
  var REQUESTS_KEY = "sweetOvenCustomCakeRequests";
  var MIN_NOTICE_DAYS = 2;
  var MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

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
  var stepperItems = document.querySelectorAll("#cakeProcessStepper .cake-step");

  // Step 1 Upload & Presets
  var uploadDropzone = document.getElementById("uploadDropzone");
  var designUploadInput = document.getElementById("designUploadInput");
  var designUploadError = document.getElementById("designUploadError");
  var uploadPreviewCard = document.getElementById("uploadPreviewCard");
  var uploadPreviewImg = document.getElementById("uploadPreviewImg");
  var uploadFileName = document.getElementById("uploadFileName");
  var removeUploadBtn = document.getElementById("removeUploadBtn");
  var designPresetsContainer = document.getElementById("designPresetsContainer");

  // Step 2-4 Controls & Extra Options
  var sizeSelect = document.getElementById("cakeSize");
  var spongeSelect = document.getElementById("cakeSponge");
  var cakeMessageInput = document.getElementById("cakeMessage");
  var cakeMessageCount = document.getElementById("cakeMessageCount");
  var cakeMessageError = document.getElementById("cakeMessageError");

  var occasionSelect = document.getElementById("cakeOccasion");
  var fillingSelect = document.getElementById("cakeFilling");
  var frostingSelect = document.getElementById("cakeFrosting");
  var dietarySelect = document.getElementById("cakeDietary");
  var toppingsContainer = document.getElementById("toppingsContainer");
  var cakeThemeNotes = document.getElementById("cakeThemeNotes");

  // Step 5 Schedule & Contact
  var eventDateInput = document.getElementById("eventDate");
  var eventDateError = document.getElementById("eventDateError");
  var deliveryAreaSelect = document.getElementById("deliveryArea");
  var customerNameInput = document.getElementById("customerName");
  var customerNameError = document.getElementById("customerNameError");
  var customerPhoneInput = document.getElementById("customerPhone");
  var customerPhoneError = document.getElementById("customerPhoneError");
  var customerEmailInput = document.getElementById("customerEmail");
  var customerEmailError = document.getElementById("customerEmailError");

  // Live Summary
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

  var selectedPresetId = opts.designPresets[0].id;
  var uploadedDesign = {
    fileName: "",
    dataUrl: ""
  };

  function formatRs(amount) {
    return data.formatRs ? data.formatRs(amount) : shared.formatPKR(amount);
  }

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

  function renderDesignPresets() {
    designPresetsContainer.innerHTML = "";
    for (var i = 0; i < opts.designPresets.length; i += 1) {
      var preset = opts.designPresets[i];
      var col = document.createElement("div");
      col.className = "col-sm-6";

      var isSelected = !uploadedDesign.fileName && selectedPresetId === preset.id;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-option-btn" + (isSelected ? " is-selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", isSelected ? "true" : "false");
      btn.setAttribute("data-preset-id", preset.id);

      var title = document.createElement("strong");
      title.className = "d-block small";
      title.textContent = preset.label;

      var note = document.createElement("small");
      note.className = "text-muted-bakery";
      note.textContent = preset.note;

      btn.appendChild(title);
      btn.appendChild(note);
      col.appendChild(btn);
      designPresetsContainer.appendChild(col);
    }
  }

  function updateUploadPreviewUI() {
    if (uploadedDesign.fileName) {
      uploadPreviewCard.classList.remove("d-none");
      uploadFileName.textContent = uploadedDesign.fileName;
      uploadPreviewImg.src = uploadedDesign.dataUrl || "../images/custom-cake.svg";
    } else {
      uploadPreviewCard.classList.add("d-none");
      uploadFileName.textContent = "";
      uploadPreviewImg.src = "../images/custom-cake.svg";
    }
    renderDesignPresets();
  }

  function handleSelectedFile(file) {
    designUploadError.textContent = "";
    if (!file) {
      return;
    }
    if (!file.type || file.type.indexOf("image/") !== 0) {
      designUploadError.textContent = "Please choose a valid image file (PNG, JPG, or WEBP).";
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      designUploadError.textContent = "Image is too large (max 5 MB). Please pick a smaller image or choose a preset style below.";
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      uploadedDesign.fileName = file.name;
      uploadedDesign.dataUrl = typeof ev.target.result === "string" && ev.target.result.length < 300000
        ? ev.target.result
        : "../images/custom-cake.svg";
      updateUploadPreviewUI();
      updateSummary();
      saveDraft();
    };
    reader.readAsDataURL(file);
  }

  function populateFormOptions() {
    populateSelect(
      sizeSelect,
      opts.sizes,
      function (item) { return item.label + " — " + formatRs(item.basePrice); },
      function (item) { return item.id; }
    );
    populateSelect(
      spongeSelect,
      opts.sponges,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + formatRs(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      occasionSelect,
      opts.occasions,
      function (item) { return item; },
      function (item) { return item; }
    );
    populateSelect(
      fillingSelect,
      opts.fillings,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + formatRs(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      frostingSelect,
      opts.frostings,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + formatRs(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      dietarySelect,
      opts.dietaryOptions,
      function (item) {
        return item.extraPrice > 0
          ? item.label + " (+ " + formatRs(item.extraPrice) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );
    populateSelect(
      deliveryAreaSelect,
      opts.deliveryAreas,
      function (item) {
        return item.fee > 0
          ? item.label + " (+ " + formatRs(item.fee) + ")"
          : item.label;
      },
      function (item) { return item.id; }
    );

    renderDesignPresets();
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
      priceSpan.textContent = "+ " + formatRs(topping.price);

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
    var preset = findOptionById(opts.designPresets, selectedPresetId);

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

    var designChoiceLabel = uploadedDesign.fileName
      ? "Uploaded: " + uploadedDesign.fileName
      : preset.label;

    return {
      designChoiceLabel: designChoiceLabel,
      presetId: preset.id,
      uploadedFileName: uploadedDesign.fileName,
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

  function updateStepperProgress(cfg) {
    var step1Done = Boolean(uploadedDesign.fileName || selectedPresetId);
    var step2Done = Boolean(cfg.size && cfg.size.id);
    var step3Done = Boolean(cfg.sponge && cfg.sponge.id);
    var step4Done = cfg.message.length > 0;
    var step5Ready = Boolean(cfg.customerName && cfg.customerPhone && cfg.eventDate);

    var doneFlags = [step1Done, step2Done, step3Done, step4Done, step5Ready];
    for (var i = 0; i < stepperItems.length; i += 1) {
      var item = stepperItems[i];
      var isDone = doneFlags[i];
      var isActive = (i === 4 && step1Done && step2Done && step3Done) || (i === 0 && !step1Done);
      item.classList.toggle("is-done", isDone);
      item.classList.toggle("is-active", isActive || (i === 3 && step4Done));
    }
  }

  function updateSummary() {
    var cfg = getCurrentConfig();

    previewOccasion.textContent = cfg.occasion;
    previewTitle.textContent = cfg.size.label + " — " + cfg.sponge.label;
    previewInscription.textContent = cfg.message
      ? "\"" + cfg.message + "\""
      : "No cake message added";

    cakeMessageCount.textContent = String(cakeMessageInput.value.length);

    var specRows = [
      { label: "Design", value: cfg.designChoiceLabel },
      { label: "Size", value: cfg.size.label + " (" + cfg.size.servings + ")" },
      { label: "Flavor", value: cfg.sponge.label },
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

    priceBase.textContent = formatRs(cfg.pricing.basePrice);
    priceUpgrades.textContent = formatRs(cfg.pricing.upgradePrice);
    priceDietary.textContent = formatRs(cfg.pricing.dietaryPrice);
    priceToppings.textContent = formatRs(cfg.pricing.toppingsPrice);
    priceDelivery.textContent = cfg.pricing.deliveryFee === 0
      ? "Free Pickup"
      : formatRs(cfg.pricing.deliveryFee);
    priceTotal.textContent = formatRs(cfg.pricing.total);

    updateStepperProgress(cfg);
  }

  function saveDraft() {
    var draft = {
      presetId: selectedPresetId,
      uploadedFileName: uploadedDesign.fileName,
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
      if (draft.presetId) selectedPresetId = findOptionById(opts.designPresets, draft.presetId).id;
      if (draft.uploadedFileName) {
        uploadedDesign.fileName = String(draft.uploadedFileName);
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
      updateUploadPreviewUI();
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
      setFieldError(cakeMessageInput, cakeMessageError, "Cake message cannot exceed 50 characters.");
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
      link.className = "btn btn-sm btn-pink";
      link.textContent = "Go to Cart";
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
      statusBadge.textContent = req.status || "Order Placed";

      headerRow.appendChild(idEl);
      headerRow.appendChild(statusBadge);

      var specsEl = document.createElement("p");
      specsEl.className = "small text-muted-bakery mb-2";
      specsEl.textContent = req.sizeLabel + " | " + req.spongeLabel + " | " + (req.designChoice || "Custom Design");

      var dateEl = document.createElement("p");
      dateEl.className = "small mb-2";
      dateEl.textContent = "Event Date: " + req.eventDate + " • For " + req.customerName + " (" + req.customerPhone + ")";

      card.appendChild(headerRow);
      card.appendChild(specsEl);
      card.appendChild(dateEl);

      if (req.message) {
        var msgEl = document.createElement("p");
        msgEl.className = "small fst-italic mb-2";
        msgEl.textContent = "Message: \"" + req.message + "\"";
        card.appendChild(msgEl);
      }

      var footerRow = document.createElement("div");
      footerRow.className = "mt-auto pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2";

      var priceEl = document.createElement("strong");
      priceEl.className = "fs-5";
      priceEl.style.color = "#B83352";
      priceEl.textContent = formatRs(req.cakeSubtotal);

      var btnGroup = document.createElement("div");
      btnGroup.className = "d-flex gap-2";

      var addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btn btn-pink btn-sm";
      addBtn.setAttribute("data-action", "add-request-cart");
      addBtn.setAttribute("data-request-id", req.requestId);
      addBtn.textContent = "Add to Cart";

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
    uploadedDesign = { fileName: "", dataUrl: "" };
    designUploadInput.value = "";
    designUploadError.textContent = "";
    selectedPresetId = opts.designPresets[0].id;

    populateFormOptions();
    updateUploadPreviewUI();
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
    showFeedback("Custom cake builder reset to defaults (Small 1kg, Chocolate).", false, false);
  }

  // Step 1 Upload & Preset Events
  designUploadInput.addEventListener("change", function () {
    if (designUploadInput.files && designUploadInput.files[0]) {
      handleSelectedFile(designUploadInput.files[0]);
    }
  });

  uploadDropzone.addEventListener("dragover", function (event) {
    event.preventDefault();
    uploadDropzone.classList.add("is-dragover");
  });

  uploadDropzone.addEventListener("dragleave", function () {
    uploadDropzone.classList.remove("is-dragover");
  });

  uploadDropzone.addEventListener("drop", function (event) {
    event.preventDefault();
    uploadDropzone.classList.remove("is-dragover");
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleSelectedFile(event.dataTransfer.files[0]);
    }
  });

  removeUploadBtn.addEventListener("click", function () {
    uploadedDesign = { fileName: "", dataUrl: "" };
    designUploadInput.value = "";
    designUploadError.textContent = "";
    updateUploadPreviewUI();
    updateSummary();
    saveDraft();
  });

  designPresetsContainer.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-preset-id]");
    if (!btn) {
      return;
    }
    selectedPresetId = btn.getAttribute("data-preset-id");
    uploadedDesign = { fileName: "", dataUrl: "" };
    designUploadInput.value = "";
    designUploadError.textContent = "";
    updateUploadPreviewUI();
    updateSummary();
    saveDraft();
  });

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
      showFeedback("Please choose a valid event date (at least 48 hours ahead) before adding to cart.", false, true);
      return;
    }
    var cfg = getCurrentConfig();
    var desc = cfg.size.label + " • " + cfg.sponge.label + " • " + cfg.designChoiceLabel + " (Date: " + cfg.eventDate + ")";
    var uniqueId = "custom-cake-" + cfg.size.id + "-" + cfg.sponge.id + "-" + cfg.eventDate;
    addCustomCakeConfigToCart(
      "Custom " + cfg.sponge.label + " Cake",
      desc,
      cfg.pricing.cakeSubtotal,
      uniqueId
    );
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm(true)) {
      showFeedback("Please fix the highlighted fields before placing your custom cake order.", false, true);
      return;
    }

    var cfg = getCurrentConfig();
    var randomCode = Math.floor(1000 + Math.random() * 9000);
    var requestRecord = {
      requestId: "TSO-CAKE-" + randomCode,
      createdAt: new Date().toISOString(),
      status: "Order Placed",
      designChoice: cfg.designChoiceLabel,
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
      "Order " + requestRecord.requestId + " placed! Estimated quote: " + formatRs(requestRecord.total) + ". Our baker will confirm on WhatsApp (" + cfg.customerPhone + ").",
      true,
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
      showFeedback("Removed custom cake order " + reqId + ".", false, false);
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
    showFeedback("Cleared all saved custom cake orders.", false, false);
  });

  populateFormOptions();
  loadDraft();
  updateSummary();
  renderSavedRequests();
})();
