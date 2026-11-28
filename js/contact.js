(function () {
  "use strict";

  var CART_STORAGE_KEY = "sweetOvenCart";
  var PREFERRED_AREA_KEY = "sweetOvenPreferredArea";
  var PREFERRED_SLOT_KEY = "sweetOvenPreferredSlot";
  var DELIVERY_NOTE_KEY = "sweetOvenDeliveryOrderNote";
  var CONTACT_DRAFT_KEY = "sweetOvenContactDraft";
  var CONTACT_INQUIRIES_KEY = "sweetOvenContactInquiries";

  var contactChannels = [
    {
      label: "Phone & WhatsApp Orders",
      value: "+92 300 1234567",
      detail: "Open: Mon to Sun, 8am to 8pm.",
      href: "tel:+923001234567",
      linkText: "Call Kitchen Desk"
    },
    {
      label: "Home Kitchen Pickup",
      value: "Street 14, Sector F-8/3",
      detail: "Islamabad • Free self-pickup during your chosen dispatch slot.",
      href: "#deliveryCheckerHeading",
      linkText: "Check Pickup Slots"
    },
    {
      label: "Email & Custom Cakes",
      value: "hello@thesweetoven.pk",
      detail: "Send inspiration photos or event headcount for 48-hour cake quotes.",
      href: "mailto:hello@thesweetoven.pk",
      linkText: "Email the Baker"
    }
  ];

  // Aligned 1:1 with js/checkout.js deliveryAreas
  var deliveryZones = [
    {
      id: "pickup-f8",
      name: "Self-Pickup — F-8/3 Home Kitchen",
      city: "Islamabad",
      filterGroup: "Self-Pickup",
      fee: 0,
      eta: "Ready at selected slot (Free pickup)",
      keywords: ["pickup", "self pickup", "self-pickup", "f-8/3", "f8/3", "street 14"]
    },
    {
      id: "isb-f6-f8",
      name: "Sectors F-6, F-7 & F-8",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 200,
      eta: "35–45 mins rider delivery",
      keywords: ["f-6", "f6", "f-7", "f7", "f-8", "f8"]
    },
    {
      id: "isb-f10-f11",
      name: "Sectors F-10 & F-11",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 250,
      eta: "45–60 mins rider delivery",
      keywords: ["f-10", "f10", "f-11", "f11"]
    },
    {
      id: "isb-g9-g11",
      name: "Sectors G-9, G-10 & G-11",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 250,
      eta: "45–60 mins rider delivery",
      keywords: ["g-9", "g9", "g-10", "g10", "g-11", "g11"]
    },
    {
      id: "isb-e11-d12",
      name: "Sectors E-11 & D-12",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 300,
      eta: "50–70 mins rider delivery",
      keywords: ["e-11", "e11", "d-12", "d12"]
    },
    {
      id: "rwp-chaklala",
      name: "Chaklala Scheme III & Saddar",
      city: "Rawalpindi",
      filterGroup: "Rawalpindi",
      fee: 350,
      eta: "60–75 mins chilled van delivery",
      keywords: ["chaklala", "scheme 3", "scheme iii", "saddar", "rawalpindi"]
    },
    {
      id: "isb-dha-bahria",
      name: "DHA Islamabad & Bahria Town (Phases 1–7)",
      city: "Islamabad / Rawalpindi",
      filterGroup: "Rawalpindi",
      fee: 450,
      eta: "75–90 mins chilled van delivery",
      keywords: ["dha", "bahria", "bahria town", "phase 1", "phase 2", "phase 3", "phase 4", "phase 5", "phase 6", "phase 7"]
    }
  ];

  var deliverySlots = [
    { id: "morning", label: "Morning Batch (10:00 AM – 1:00 PM)" },
    { id: "afternoon", label: "Afternoon Tea (2:00 PM – 5:00 PM)" },
    { id: "evening", label: "Evening Dessert (6:00 PM – 9:00 PM)" }
  ];

  var deliveryGuidelines = [
    {
      title: "Same-Day vs Custom Notice",
      text: "Signature brownies, rolls, and 1 lb cakes are baked daily; multi-tier custom cakes require 48 hours notice."
    },
    {
      title: "Chilled Care for Cream Bakes",
      text: "Lotus Tres Leches tubs and cream-cheese frostings travel in insulated cooler bags so texture stays firm."
    },
    {
      title: "Flexible Payment Options",
      text: "Pay via Cash on Delivery (COD), JazzCash / Easypaisa mobile wallet, or direct Raast / IBFT bank transfer."
    }
  ];

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

  var zoneFilter = "All";
  var zoneSearch = "";
  var preferredSlotId = loadPreferredSlot();
  var checkerState = initCheckerState();
  var inquiryHistory = loadInquiries();

  function loadPreferredSlot() {
    var saved = safeGet(PREFERRED_SLOT_KEY);
    var exists = deliverySlots.some(function (s) { return s.id === saved; });
    return exists ? saved : deliverySlots[1].id;
  }

  function initCheckerState() {
    var savedArea = safeGet(PREFERRED_AREA_KEY);
    if (!savedArea) {
      return { status: "none", zone: null, customQuery: "" };
    }
    if (savedArea === "outside") {
      return { status: "unserved", zone: null, customQuery: "" };
    }
    var matched = deliveryZones.find(function (z) { return z.id === savedArea; });
    if (!matched) {
      return { status: "none", zone: null, customQuery: "" };
    }
    var savedNote = safeParseJSON(safeGet(DELIVERY_NOTE_KEY), null);
    if (savedNote && savedNote.zoneId === matched.id) {
      return { status: "saved", zone: matched, customQuery: "" };
    }
    return { status: "served", zone: matched, customQuery: "" };
  }

  function loadInquiries() {
    var parsed = safeParseJSON(safeGet(CONTACT_INQUIRIES_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveInquiries() {
    return safeSet(CONTACT_INQUIRIES_KEY, JSON.stringify(inquiryHistory));
  }

  function getSavedCartSubtotal() {
    var cart = safeParseJSON(safeGet(CART_STORAGE_KEY), []);
    if (!Array.isArray(cart) || cart.length === 0) {
      return 0;
    }
    return cart.reduce(function (sum, item) {
      var price = Number(item && item.price) || 0;
      var qty = Number(item && item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }

  function renderContactChannels() {
    var grid = document.getElementById("contactChannelsGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    contactChannels.forEach(function (channel) {
      var col = createEl("div", "col-md-4");
      var card = createEl("article", "card channel-card card-hover");
      card.appendChild(createEl("p", "small fw-bold text-muted-bakery mb-1", channel.label));
      card.appendChild(createEl("h3", "h5 mb-2", channel.value));
      card.appendChild(createEl("p", "small text-muted-bakery mb-3", channel.detail));
      var link = createEl("a", "btn btn-outline-bakery btn-sm align-self-start", channel.linkText);
      link.href = channel.href;
      card.appendChild(link);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function populateCheckerDropdowns() {
    var select = document.getElementById("deliveryAreaSelect");
    var slotSelect = document.getElementById("estimatorSlotSelect");

    if (select) {
      select.innerHTML = "";
      var placeholderOpt = document.createElement("option");
      placeholderOpt.value = "";
      placeholderOpt.textContent = "Select area";
      select.appendChild(placeholderOpt);

      deliveryZones.forEach(function (zone) {
        var opt = document.createElement("option");
        opt.value = zone.id;
        opt.textContent = zone.name + " (" + (zone.fee === 0 ? "Free" : formatPKR(zone.fee)) + ")";
        select.appendChild(opt);
      });

      var outsideOpt = document.createElement("option");
      outsideOpt.value = "outside";
      outsideOpt.textContent = "Other / Outside Islamabad & Rawalpindi";
      select.appendChild(outsideOpt);

      if ((checkerState.status === "served" || checkerState.status === "saved") && checkerState.zone) {
        select.value = checkerState.zone.id;
      } else if (checkerState.status === "unserved") {
        select.value = "outside";
      } else {
        select.value = "";
      }
    }

    if (slotSelect) {
      slotSelect.innerHTML = "";
      deliverySlots.forEach(function (slot) {
        var opt = document.createElement("option");
        opt.value = slot.id;
        opt.textContent = slot.label;
        slotSelect.appendChild(opt);
      });
      slotSelect.value = preferredSlotId;
    }
  }

  function findServedZoneByQuery(query) {
    var normalized = query.trim().toLowerCase();
    return deliveryZones.find(function (zone) {
      if (zone.name.toLowerCase().indexOf(normalized) !== -1) {
        return true;
      }
      return zone.keywords.some(function (kw) {
        return normalized === kw || normalized.indexOf(kw) !== -1;
      });
    }) || null;
  }

  function renderDeliveryResult() {
    var box = document.getElementById("deliveryResultBox");
    var addBtn = document.getElementById("addFeeToNoteBtn");
    var confirmText = document.getElementById("addFeeConfirm");

    if (!box) {
      return;
    }

    box.innerHTML = "";
    box.classList.remove("is-served", "is-unserved", "is-saved");

    if (confirmText) {
      confirmText.classList.add("d-none");
      confirmText.textContent = "";
    }

    // State 1: Initial / No area selected
    if (checkerState.status === "none") {
      if (addBtn) { addBtn.classList.add("d-none"); }
      box.appendChild(createEl("strong", "d-block mb-1", "No area selected yet."));
      box.appendChild(
        createEl(
          "p",
          "small text-muted-bakery mb-0",
          "Choose an area from the dropdown and click Check to view delivery availability and PKR fee."
        )
      );
      return;
    }

    // State 2: Area not served
    if (checkerState.status === "unserved") {
      box.classList.add("is-unserved");
      if (addBtn) { addBtn.classList.add("d-none"); }
      var queryLabel = checkerState.customQuery ? '"' + checkerState.customQuery + '"' : "this area";
      box.appendChild(createEl("strong", "d-block mb-1", "We do not deliver to " + queryLabel + " yet."));
      box.appendChild(
        createEl(
          "p",
          "small mb-0",
          "Currently we serve Islamabad Sectors F-6 to F-11, G-9 to G-11, E-11, D-12, Chaklala Scheme III & Saddar, and DHA / Bahria Town (Phases 1–7). Free self-pickup is available from Street 14, F-8/3."
        )
      );
      return;
    }

    var zone = checkerState.zone;
    var slot = deliverySlots.find(function (s) { return s.id === preferredSlotId; }) || deliverySlots[0];
    var feeText = zone.fee === 0 ? "Free (PKR 0)" : formatPKR(zone.fee);
    var subtotal = getSavedCartSubtotal();

    // State 3 (Served) & State 4 (Saved / Added to order note)
    box.classList.add("is-served");
    if (checkerState.status === "saved") {
      box.classList.add("is-saved");
    }
    if (addBtn) {
      addBtn.classList.remove("d-none");
      addBtn.textContent = checkerState.status === "saved" ? "Update order note" : "Add fee to order note";
    }

    var titleRow = createEl("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1");
    titleRow.appendChild(createEl("strong", "", zone.name));
    titleRow.appendChild(createEl("span", "badge badge-pink rounded-pill", "Delivery Fee: " + feeText));
    box.appendChild(titleRow);

    box.appendChild(createEl("p", "small mb-1", "Estimated Arrival: " + zone.eta));
    box.appendChild(createEl("p", "small text-muted-bakery mb-1", "Dispatch Slot: " + slot.label));

    if (subtotal > 0) {
      box.appendChild(
        createEl(
          "p",
          "small fw-bold mb-0",
          "Current Cart (" + formatPKR(subtotal) + ") + Delivery (" + feeText + ") = " + formatPKR(subtotal + zone.fee)
        )
      );
    }

    if (checkerState.status === "saved" && confirmText) {
      confirmText.textContent = "Delivery fee saved to your order note (" + zone.name + " — " + feeText + ").";
      confirmText.classList.remove("d-none");
    }
  }

  function setFieldError(inputEl, errorEl, message) {
    if (!inputEl || !errorEl) {
      return;
    }
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove("d-none");
      inputEl.classList.add("is-invalid-field");
      inputEl.setAttribute("aria-invalid", "true");
    } else {
      errorEl.textContent = "";
      errorEl.classList.add("d-none");
      inputEl.classList.remove("is-invalid-field");
      inputEl.removeAttribute("aria-invalid");
    }
  }

  function initDeliveryChecker() {
    var form = document.getElementById("deliveryCheckerForm");
    var select = document.getElementById("deliveryAreaSelect");
    var slotSelect = document.getElementById("estimatorSlotSelect");
    var errorEl = document.getElementById("deliveryCheckerError");
    var customForm = document.getElementById("customAreaCheckForm");
    var customInput = document.getElementById("customAreaCheckInput");
    var customError = document.getElementById("customAreaError");
    var addFeeBtn = document.getElementById("addFeeToNoteBtn");

    function runDropdownCheck() {
      var val = select ? select.value : "";

      if (!val) {
        if (errorEl) {
          errorEl.textContent = "Please select an area first.";
          errorEl.classList.remove("d-none");
        }
        if (select) {
          select.classList.add("is-invalid-field");
          select.focus();
        }
        checkerState = { status: "none", zone: null, customQuery: "" };
        safeRemove(PREFERRED_AREA_KEY);
        renderDeliveryResult();
        renderDeliveryZones();
        return;
      }

      if (errorEl) { errorEl.classList.add("d-none"); }
      if (select) { select.classList.remove("is-invalid-field"); }
      setFieldError(customInput, customError, "");

      if (val === "outside") {
        checkerState = { status: "unserved", zone: null, customQuery: "" };
        safeSet(PREFERRED_AREA_KEY, "outside");
      } else {
        var matched = deliveryZones.find(function (z) { return z.id === val; });
        if (matched) {
          var existingNote = safeParseJSON(safeGet(DELIVERY_NOTE_KEY), null);
          var alreadySaved = Boolean(existingNote && existingNote.zoneId === matched.id);
          checkerState = { status: alreadySaved ? "saved" : "served", zone: matched, customQuery: "" };
          safeSet(PREFERRED_AREA_KEY, matched.id);
        }
      }

      renderDeliveryResult();
      renderDeliveryZones();
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        runDropdownCheck();
      });
    }

    if (select) {
      select.addEventListener("change", function () {
        if (errorEl) { errorEl.classList.add("d-none"); }
        select.classList.remove("is-invalid-field");
      });
    }

    if (slotSelect) {
      slotSelect.addEventListener("change", function () {
        preferredSlotId = slotSelect.value;
        safeSet(PREFERRED_SLOT_KEY, preferredSlotId);
        renderDeliveryResult();
      });
    }

    if (customForm && customInput && customError) {
      customForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var raw = customInput.value.trim();

        if (!raw) {
          setFieldError(customInput, customError, "Please enter a sector or neighbourhood name to check.");
          customInput.focus();
          return;
        }

        if (!/[a-zA-Z]{2,}/.test(raw) && !/^[fgeFGE]-?\d{1,2}$/.test(raw)) {
          setFieldError(customInput, customError, "Enter a valid area name (e.g., F-7, Bahria Town, or Rawat).");
          customInput.focus();
          return;
        }

        setFieldError(customInput, customError, "");
        if (errorEl) { errorEl.classList.add("d-none"); }
        if (select) { select.classList.remove("is-invalid-field"); }

        var matchedZone = findServedZoneByQuery(raw);
        if (matchedZone) {
          var existingNote = safeParseJSON(safeGet(DELIVERY_NOTE_KEY), null);
          var alreadySaved = Boolean(existingNote && existingNote.zoneId === matchedZone.id);
          checkerState = { status: alreadySaved ? "saved" : "served", zone: matchedZone, customQuery: raw };
          safeSet(PREFERRED_AREA_KEY, matchedZone.id);
          if (select) { select.value = matchedZone.id; }
        } else {
          checkerState = { status: "unserved", zone: null, customQuery: raw };
          safeSet(PREFERRED_AREA_KEY, "outside");
          if (select) { select.value = "outside"; }
        }

        renderDeliveryResult();
        renderDeliveryZones();
      });
    }

    if (addFeeBtn) {
      addFeeBtn.addEventListener("click", function () {
        if (!checkerState.zone) {
          return;
        }
        var zone = checkerState.zone;
        var slot = deliverySlots.find(function (s) { return s.id === preferredSlotId; }) || deliverySlots[0];
        var feeText = zone.fee === 0 ? "Free (PKR 0)" : formatPKR(zone.fee);
        var noteLine = "[Delivery Area: " + zone.name + " — " + feeText + " | " + slot.label + "]";

        var messageInput = document.getElementById("contactMessage");
        if (messageInput) {
          var existing = messageInput.value.trim().replace(/\[Delivery Area:[^\]]*\]/g, "").trim();
          messageInput.value = existing ? existing + "\n" + noteLine : noteLine;
          messageInput.dispatchEvent(new Event("input"));
        }

        safeSet(DELIVERY_NOTE_KEY, JSON.stringify({
          zoneId: zone.id,
          zoneName: zone.name,
          fee: zone.fee,
          slot: slot.label,
          note: noteLine
        }));

        checkerState = { status: "saved", zone: zone, customQuery: checkerState.customQuery };
        renderDeliveryResult();
      });
    }
  }

  function renderZoneFilterBar() {
    var bar = document.getElementById("zoneFilterBar");
    if (!bar) {
      return;
    }
    bar.innerHTML = "";

    ["All", "Islamabad", "Rawalpindi", "Self-Pickup"].forEach(function (group) {
      var btn = createEl(
        "button",
        "zone-filter-btn" + (zoneFilter === group ? " is-active" : ""),
        group
      );
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(zoneFilter === group));
      btn.addEventListener("click", function () {
        zoneFilter = group;
        renderZoneFilterBar();
        renderDeliveryZones();
      });
      bar.appendChild(btn);
    });
  }

  function renderDeliveryZones() {
    var grid = document.getElementById("deliveryZonesGrid");
    var emptyState = document.getElementById("zonesEmptyState");
    var emptyText = document.getElementById("zonesEmptyText");
    if (!grid || !emptyState) {
      return;
    }

    grid.innerHTML = "";
    var query = zoneSearch.trim().toLowerCase();

    var filtered = deliveryZones.filter(function (zone) {
      var matchesGroup = zoneFilter === "All" || zone.filterGroup === zoneFilter;
      var matchesQuery = !query ||
        zone.name.toLowerCase().indexOf(query) !== -1 ||
        zone.city.toLowerCase().indexOf(query) !== -1 ||
        zone.eta.toLowerCase().indexOf(query) !== -1;
      return matchesGroup && matchesQuery;
    });

    if (filtered.length === 0) {
      emptyState.classList.remove("d-none");
      if (emptyText) {
        emptyText.textContent = query
          ? 'No delivery areas matched "' + zoneSearch.trim() + '".'
          : "No zones match the selected filter.";
      }
      return;
    }

    emptyState.classList.add("d-none");

    filtered.forEach(function (zone) {
      var isSelected = checkerState.zone && checkerState.zone.id === zone.id;
      var col = createEl("div", "col-sm-6");
      var card = createEl("article", "card zone-card card-hover" + (isSelected ? " is-preferred" : ""));

      var top = createEl("div", "");
      top.appendChild(createEl("p", "small fw-bold text-muted-bakery mb-1", zone.city));
      top.appendChild(createEl("h3", "h6 mb-1", zone.name));
      top.appendChild(createEl("p", "small text-muted-bakery mb-2", zone.eta));

      var bottom = createEl("div", "d-flex justify-content-between align-items-center pt-2 border-top");
      bottom.appendChild(createEl("span", "zone-fee", zone.fee === 0 ? "Free" : formatPKR(zone.fee)));

      var selectBtn = createEl(
        "button",
        "btn btn-sm " + (isSelected ? "btn-bakery" : "btn-outline-bakery"),
        isSelected ? "Checked" : "Check"
      );
      selectBtn.type = "button";
      selectBtn.addEventListener("click", function () {
        var select = document.getElementById("deliveryAreaSelect");
        var errorEl = document.getElementById("deliveryCheckerError");
        if (select) {
          select.value = zone.id;
          select.classList.remove("is-invalid-field");
        }
        if (errorEl) {
          errorEl.classList.add("d-none");
        }
        checkerState = { status: "served", zone: zone, customQuery: "" };
        safeSet(PREFERRED_AREA_KEY, zone.id);
        renderDeliveryResult();
        renderDeliveryZones();
      });

      bottom.appendChild(selectBtn);
      card.appendChild(top);
      card.appendChild(bottom);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderGuidelines() {
    var grid = document.getElementById("guidelinesGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    deliveryGuidelines.forEach(function (item) {
      var col = createEl("div", "col-md-4");
      var card = createEl("article", "card guideline-card");
      card.appendChild(createEl("h3", "h5 mb-2", item.title));
      card.appendChild(createEl("p", "text-muted-bakery small mb-0", item.text));
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function initZoneSearch() {
    var searchInput = document.getElementById("zoneSearchInput");
    var resetBtn = document.getElementById("resetZoneFilterBtn");

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        zoneSearch = searchInput.value;
        renderDeliveryZones();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        zoneFilter = "All";
        zoneSearch = "";
        if (searchInput) {
          searchInput.value = "";
        }
        renderZoneFilterBar();
        renderDeliveryZones();
      });
    }
  }

  function renderInquiryHistory() {
    var list = document.getElementById("inquiryHistoryList");
    var empty = document.getElementById("emptyInquiriesState");
    if (!list || !empty) {
      return;
    }
    list.innerHTML = "";

    if (inquiryHistory.length === 0) {
      empty.classList.remove("d-none");
      return;
    }

    empty.classList.add("d-none");

    inquiryHistory.forEach(function (entry, index) {
      var card = createEl("article", "card inquiry-item-card");
      var top = createEl("div", "d-flex justify-content-between align-items-start gap-2 mb-1");
      top.appendChild(createEl("strong", "small", entry.ref + " • " + entry.subject));

      var removeBtn = createEl("button", "btn btn-sm btn-outline-bakery py-0 px-2", "Remove");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove message " + entry.ref);
      removeBtn.addEventListener("click", function () {
        inquiryHistory.splice(index, 1);
        saveInquiries();
        renderInquiryHistory();
      });

      top.appendChild(removeBtn);
      card.appendChild(top);
      card.appendChild(createEl("p", "small text-muted-bakery mb-1", entry.name + " • " + entry.submittedAt));
      card.appendChild(createEl("p", "small mb-0", entry.message));
      list.appendChild(card);
    });
  }

  function showFormStatus(type, message) {
    var banner = document.getElementById("contactFormStatus");
    if (!banner) {
      return;
    }
    banner.textContent = message;
    banner.classList.remove("d-none", "is-success", "is-error");
    banner.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    var nameInput = document.getElementById("contactName");
    var emailInput = document.getElementById("contactEmail");
    var subjectInput = document.getElementById("contactSubject");
    var messageInput = document.getElementById("contactMessage");
    var resetBtn = document.getElementById("resetContactFormBtn");
    var clearHistoryBtn = document.getElementById("clearInquiriesBtn");

    var nameErr = document.getElementById("contactNameError");
    var emailErr = document.getElementById("contactEmailError");
    var subjectErr = document.getElementById("contactSubjectError");
    var messageErr = document.getElementById("contactMessageError");

    if (!form) {
      return;
    }

    var draft = safeParseJSON(safeGet(CONTACT_DRAFT_KEY), null);
    if (draft) {
      if (draft.name) { nameInput.value = draft.name; }
      if (draft.email) { emailInput.value = draft.email; }
      if (draft.subject) { subjectInput.value = draft.subject; }
      if (draft.message) { messageInput.value = draft.message; }
    }

    function saveDraft() {
      safeSet(CONTACT_DRAFT_KEY, JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value
      }));
    }

    [nameInput, emailInput, subjectInput, messageInput].forEach(function (field) {
      if (field) {
        field.addEventListener("input", saveDraft);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameVal = nameInput.value.trim();
      var emailVal = emailInput.value.trim();
      var subjectVal = subjectInput.value.trim();
      var messageVal = messageInput.value.trim();

      var isValid = true;
      var firstInvalid = null;

      if (nameVal.length < 2) {
        setFieldError(nameInput, nameErr, "Please enter your name (at least 2 characters).");
        isValid = false;
        firstInvalid = firstInvalid || nameInput;
      } else {
        setFieldError(nameInput, nameErr, "");
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(emailVal)) {
        setFieldError(emailInput, emailErr, "Please enter a valid email address.");
        isValid = false;
        firstInvalid = firstInvalid || emailInput;
      } else {
        setFieldError(emailInput, emailErr, "");
      }

      if (subjectVal.length < 3) {
        setFieldError(subjectInput, subjectErr, "Please enter a subject (at least 3 characters).");
        isValid = false;
        firstInvalid = firstInvalid || subjectInput;
      } else {
        setFieldError(subjectInput, subjectErr, "");
      }

      if (messageVal.length < 10) {
        setFieldError(messageInput, messageErr, "Please write a message of at least 10 characters.");
        isValid = false;
        firstInvalid = firstInvalid || messageInput;
      } else {
        setFieldError(messageInput, messageErr, "");
      }

      if (!isValid) {
        showFormStatus("error", "Please fix the errors below before sending your message.");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      var refCode = "TSO-INQ-" + Math.floor(1000 + Math.random() * 9000);
      inquiryHistory.unshift({
        ref: refCode,
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
        submittedAt: new Date().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })
      });
      saveInquiries();
      renderInquiryHistory();

      safeRemove(CONTACT_DRAFT_KEY);
      form.reset();
      showFormStatus("success", "Message sent! Reference " + refCode + " has been saved.");
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        safeRemove(CONTACT_DRAFT_KEY);
        setFieldError(nameInput, nameErr, "");
        setFieldError(emailInput, emailErr, "");
        setFieldError(subjectInput, subjectErr, "");
        setFieldError(messageInput, messageErr, "");
        var banner = document.getElementById("contactFormStatus");
        if (banner) {
          banner.classList.add("d-none");
        }
      });
    }

    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", function () {
        inquiryHistory = [];
        saveInquiries();
        renderInquiryHistory();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    populateCheckerDropdowns();
    renderDeliveryResult();
    initDeliveryChecker();
    renderContactChannels();
    renderZoneFilterBar();
    renderDeliveryZones();
    renderGuidelines();
    initZoneSearch();
    renderInquiryHistory();
    initContactForm();
  });
})();
