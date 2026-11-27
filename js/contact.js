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
      detail: "Mon – Sat: 8:00 AM – 8:00 PM • Sunday: 9:00 AM – 5:00 PM",
      href: "tel:+923001234567",
      linkText: "Call Kitchen Desk"
    },
    {
      label: "Home Kitchen Pickup",
      value: "Street 14, Sector F-8/3",
      detail: "Islamabad • Free self-pickup during your chosen dispatch slot.",
      href: "#estimatorHeading",
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
      eta: "Ready at selected slot (No delivery charge)",
      keywords: ["pickup", "self pickup", "self-pickup", "f-8/3", "f8/3", "street 14"],
      isPickup: true
    },
    {
      id: "isb-f6-f8",
      name: "Sectors F-6, F-7 & F-8",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 200,
      eta: "35–45 mins rider delivery",
      keywords: ["f-6", "f6", "f-7", "f7", "f-8", "f8"],
      isPickup: false
    },
    {
      id: "isb-f10-f11",
      name: "Sectors F-10 & F-11",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 250,
      eta: "45–60 mins rider delivery",
      keywords: ["f-10", "f10", "f-11", "f11"],
      isPickup: false
    },
    {
      id: "isb-g9-g11",
      name: "Sectors G-9, G-10 & G-11",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 250,
      eta: "45–60 mins rider delivery",
      keywords: ["g-9", "g9", "g-10", "g10", "g-11", "g11"],
      isPickup: false
    },
    {
      id: "isb-e11-d12",
      name: "Sectors E-11 & D-12",
      city: "Islamabad",
      filterGroup: "Islamabad",
      fee: 300,
      eta: "50–70 mins rider delivery",
      keywords: ["e-11", "e11", "d-12", "d12"],
      isPickup: false
    },
    {
      id: "rwp-chaklala",
      name: "Chaklala Scheme III & Saddar",
      city: "Rawalpindi",
      filterGroup: "Rawalpindi",
      fee: 350,
      eta: "60–75 mins chilled van delivery",
      keywords: ["chaklala", "scheme 3", "scheme iii", "saddar", "rawalpindi"],
      isPickup: false
    },
    {
      id: "isb-dha-bahria",
      name: "DHA Islamabad & Bahria Town (Phases 1–7)",
      city: "Islamabad / Rawalpindi",
      filterGroup: "Rawalpindi",
      fee: 450,
      eta: "75–90 mins chilled van delivery",
      keywords: ["dha", "bahria", "bahria town", "phase 1", "phase 2", "phase 3", "phase 4", "phase 5", "phase 6", "phase 7"],
      isPickup: false
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

  var zoneFilter = "All";
  var zoneSearch = "";
  var preferredSlotId = loadPreferredSlot();
  var checkerState = initCheckerState();
  var inquiryHistory = loadInquiries();

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

  function initCheckerState() {
    var saved = safeGet(PREFERRED_AREA_KEY);
    if (!saved) {
      return { status: "none", zone: null, customQuery: "" };
    }
    if (saved === "not-served") {
      return { status: "unserved", zone: null, customQuery: "" };
    }
    var matchedZone = deliveryZones.find(function (z) { return z.id === saved; });
    if (matchedZone) {
      return { status: "served", zone: matchedZone, customQuery: "" };
    }
    return { status: "none", zone: null, customQuery: "" };
  }

  function loadPreferredSlot() {
    var saved = safeGet(PREFERRED_SLOT_KEY);
    var exists = deliverySlots.some(function (s) { return s.id === saved; });
    return exists ? saved : deliverySlots[1].id;
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
      var label = createEl("p", "small fw-bold text-muted-bakery mb-1", channel.label);
      var val = createEl("h3", "h5 mb-2", channel.value);
      var detail = createEl("p", "small text-muted-bakery mb-3", channel.detail);
      var link = createEl("a", "btn btn-outline-bakery btn-sm align-self-start", channel.linkText);
      link.href = channel.href;

      card.appendChild(label);
      card.appendChild(val);
      card.appendChild(detail);
      card.appendChild(link);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function populateSelects() {
    var estimatorArea = document.getElementById("estimatorAreaSelect");
    var estimatorSlot = document.getElementById("estimatorSlotSelect");
    var contactArea = document.getElementById("contactArea");

    if (estimatorArea) {
      estimatorArea.innerHTML = "";

      var chooseOpt = document.createElement("option");
      chooseOpt.value = "";
      chooseOpt.textContent = "-- Choose an area --";
      estimatorArea.appendChild(chooseOpt);

      deliveryZones.forEach(function (zone) {
        var opt = document.createElement("option");
        opt.value = zone.id;
        opt.textContent = zone.name + " (" + (zone.fee === 0 ? "Free" : formatPKR(zone.fee)) + ")";
        estimatorArea.appendChild(opt);
      });

      var outsideOpt = document.createElement("option");
      outsideOpt.value = "not-served";
      outsideOpt.textContent = "Other / Outside Listed Sectors";
      estimatorArea.appendChild(outsideOpt);

      if (checkerState.status === "served" && checkerState.zone) {
        estimatorArea.value = checkerState.zone.id;
      } else if (checkerState.status === "unserved") {
        estimatorArea.value = "not-served";
      } else {
        estimatorArea.value = "";
      }
    }

    if (estimatorSlot) {
      estimatorSlot.innerHTML = "";
      deliverySlots.forEach(function (slot) {
        var opt = document.createElement("option");
        opt.value = slot.id;
        opt.textContent = slot.label;
        estimatorSlot.appendChild(opt);
      });
      estimatorSlot.value = preferredSlotId;
    }

    if (contactArea) {
      contactArea.innerHTML = "";
      var defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "Not sure yet / Ask baker";
      contactArea.appendChild(defaultOpt);

      deliveryZones.forEach(function (zone) {
        var opt = document.createElement("option");
        opt.value = zone.name;
        opt.textContent = zone.name;
        contactArea.appendChild(opt);
      });
    }
  }

  function renderDeliveryChecker() {
    var output = document.getElementById("estimatorOutput");
    var addBtn = document.getElementById("addFeeToNoteBtn");
    var confirmBox = document.getElementById("addFeeConfirm");

    if (!output) {
      return;
    }

    output.innerHTML = "";
    output.classList.remove("is-unserved", "is-served");

    if (confirmBox && checkerState.status !== "served") {
      confirmBox.classList.add("d-none");
    }

    // State (a): No area chosen
    if (checkerState.status === "none") {
      if (addBtn) {
        addBtn.disabled = true;
      }
      output.appendChild(createEl("strong", "d-block mb-1", "No area selected yet"));
      output.appendChild(
        createEl(
          "p",
          "small text-muted-bakery mb-0",
          "Please select an area from the dropdown or enter your sector above to check delivery availability and PKR fee."
        )
      );
      return;
    }

    // State (b): Area not served
    if (checkerState.status === "unserved") {
      output.classList.add("is-unserved");
      if (addBtn) {
        addBtn.disabled = true;
      }
      var areaLabel = checkerState.customQuery ? '"' + checkerState.customQuery + '"' : "that area";
      output.appendChild(createEl("strong", "d-block mb-1", "We do not deliver to " + areaLabel + " yet"));
      output.appendChild(
        createEl(
          "p",
          "small mb-0",
          "Currently we only deliver to Sectors F-6 to F-11, G-9 to G-11, E-11, D-12, Chaklala Scheme III & Saddar, and DHA / Bahria Town (Phases 1–7), or you can collect free from our F-8/3 kitchen."
        )
      );
      return;
    }

    // State (c): Area served
    output.classList.add("is-served");
    if (addBtn) {
      addBtn.disabled = false;
    }

    var zone = checkerState.zone;
    var slot = deliverySlots.find(function (s) { return s.id === preferredSlotId; }) || deliverySlots[0];
    var cartSubtotal = getSavedCartSubtotal();

    var topLine = createEl("div", "d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2");
    topLine.appendChild(createEl("strong", "", zone.name));
    topLine.appendChild(
      createEl(
        "span",
        "badge badge-pink rounded-pill",
        zone.fee === 0 ? "Free Pickup (" + formatPKR(0) + ")" : "Delivery Fee: " + formatPKR(zone.fee)
      )
    );

    var etaLine = createEl("p", "small mb-1", "Estimated Arrival: " + zone.eta);
    var slotLine = createEl("p", "small text-muted-bakery mb-1", "Selected Dispatch Slot: " + slot.label);

    output.appendChild(topLine);
    output.appendChild(etaLine);
    output.appendChild(slotLine);

    if (cartSubtotal > 0) {
      output.appendChild(
        createEl(
          "p",
          "small fw-bold mb-0 mt-2",
          "Your current basket (" + formatPKR(cartSubtotal) + ") + delivery = " + formatPKR(cartSubtotal + zone.fee)
        )
      );
    } else {
      output.appendChild(
        createEl(
          "p",
          "small text-muted-bakery mb-0 mt-2",
          "Use \"Add fee to order note\" to attach this PKR rate to your inquiry message."
        )
      );
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

  function renderZoneFilterBar() {
    var bar = document.getElementById("zoneFilterBar");
    if (!bar) {
      return;
    }
    bar.innerHTML = "";

    var groups = ["All", "Islamabad", "Rawalpindi", "Self-Pickup"];
    groups.forEach(function (group) {
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
      var matchesSearch = !query ||
        zone.name.toLowerCase().indexOf(query) !== -1 ||
        zone.city.toLowerCase().indexOf(query) !== -1 ||
        zone.eta.toLowerCase().indexOf(query) !== -1;
      return matchesGroup && matchesSearch;
    });

    if (filtered.length === 0) {
      emptyState.classList.remove("d-none");
      if (emptyText) {
        emptyText.textContent = query
          ? 'No delivery areas matched "' + zoneSearch.trim() + '". Message us below for custom rider quotes.'
          : "No zones match the selected filter.";
      }
      return;
    }

    emptyState.classList.add("d-none");

    filtered.forEach(function (zone) {
      var isPreferred = checkerState.status === "served" && checkerState.zone && checkerState.zone.id === zone.id;
      var col = createEl("div", "col-md-6 col-lg-4");
      var card = createEl("article", "card zone-card card-hover" + (isPreferred ? " is-preferred" : ""));

      var top = createEl("div", "");
      var cityTag = createEl("p", "small fw-bold text-muted-bakery mb-1", zone.city);
      var title = createEl("h3", "h5 mb-2", zone.name);
      var eta = createEl("p", "small text-muted-bakery mb-3", zone.eta);

      top.appendChild(cityTag);
      top.appendChild(title);
      top.appendChild(eta);

      var bottom = createEl("div", "d-flex justify-content-between align-items-center pt-2 border-top");
      var fee = createEl("span", "zone-fee", zone.fee === 0 ? "Free" : formatPKR(zone.fee));
      var selectBtn = createEl(
        "button",
        "btn btn-sm " + (isPreferred ? "btn-bakery" : "btn-outline-bakery"),
        isPreferred ? "Selected Zone" : "Select Zone"
      );
      selectBtn.type = "button";
      selectBtn.addEventListener("click", function () {
        checkerState = { status: "served", zone: zone, customQuery: "" };
        safeSet(PREFERRED_AREA_KEY, zone.id);
        var estimatorArea = document.getElementById("estimatorAreaSelect");
        if (estimatorArea) {
          estimatorArea.value = zone.id;
        }
        var customError = document.getElementById("customAreaError");
        if (customError) {
          customError.classList.add("d-none");
        }
        renderDeliveryChecker();
        renderDeliveryZones();
      });

      bottom.appendChild(fee);
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
      var headerRow = createEl("div", "d-flex justify-content-between align-items-start gap-2 mb-1");
      headerRow.appendChild(createEl("strong", "small", entry.ref + " • " + entry.topic));

      var delBtn = createEl("button", "btn btn-sm btn-outline-bakery py-0 px-2", "Remove");
      delBtn.type = "button";
      delBtn.setAttribute("aria-label", "Remove inquiry " + entry.ref);
      delBtn.addEventListener("click", function () {
        inquiryHistory.splice(index, 1);
        saveInquiries();
        renderInquiryHistory();
      });

      headerRow.appendChild(delBtn);

      var meta = createEl("p", "small text-muted-bakery mb-1", entry.name + " • " + entry.submittedAt);
      var msg = createEl("p", "small mb-0", entry.message);

      card.appendChild(headerRow);
      card.appendChild(meta);
      card.appendChild(msg);
      list.appendChild(card);
    });
  }

  function initDeliveryCheckerEvents() {
    var areaSelect = document.getElementById("estimatorAreaSelect");
    var slotSelect = document.getElementById("estimatorSlotSelect");
    var customForm = document.getElementById("customAreaCheckForm");
    var customInput = document.getElementById("customAreaCheckInput");
    var customError = document.getElementById("customAreaError");
    var addFeeBtn = document.getElementById("addFeeToNoteBtn");
    var addFeeConfirm = document.getElementById("addFeeConfirm");
    var searchInput = document.getElementById("zoneSearchInput");
    var resetBtn = document.getElementById("resetZoneFilterBtn");

    if (areaSelect) {
      areaSelect.addEventListener("change", function () {
        var val = areaSelect.value;
        if (customError) {
          customError.classList.add("d-none");
        }
        if (customInput) {
          customInput.classList.remove("is-invalid-field");
        }

        if (!val) {
          checkerState = { status: "none", zone: null, customQuery: "" };
          safeRemove(PREFERRED_AREA_KEY);
        } else if (val === "not-served") {
          checkerState = { status: "unserved", zone: null, customQuery: "" };
          safeSet(PREFERRED_AREA_KEY, "not-served");
        } else {
          var matched = deliveryZones.find(function (z) { return z.id === val; });
          if (matched) {
            checkerState = { status: "served", zone: matched, customQuery: "" };
            safeSet(PREFERRED_AREA_KEY, matched.id);
          } else {
            checkerState = { status: "none", zone: null, customQuery: "" };
          }
        }
        renderDeliveryChecker();
        renderDeliveryZones();
      });
    }

    if (slotSelect) {
      slotSelect.addEventListener("change", function () {
        preferredSlotId = slotSelect.value;
        safeSet(PREFERRED_SLOT_KEY, preferredSlotId);
        renderDeliveryChecker();
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

        // Must contain at least 2 letters (prevents symbols or numbers-only invalid input)
        if (!/[a-zA-Z]{2,}/.test(raw) && !/^[fgeFGE]-?\d{1,2}$/.test(raw)) {
          setFieldError(customInput, customError, "Please enter a valid area name (e.g., F-7, G-10, Bahria Town, or Rawat).");
          customInput.focus();
          return;
        }

        setFieldError(customInput, customError, "");
        var matchedZone = findServedZoneByQuery(raw);

        if (matchedZone) {
          checkerState = { status: "served", zone: matchedZone, customQuery: raw };
          safeSet(PREFERRED_AREA_KEY, matchedZone.id);
          if (areaSelect) {
            areaSelect.value = matchedZone.id;
          }
        } else {
          checkerState = { status: "unserved", zone: null, customQuery: raw };
          safeSet(PREFERRED_AREA_KEY, "not-served");
          if (areaSelect) {
            areaSelect.value = "not-served";
          }
        }

        renderDeliveryChecker();
        renderDeliveryZones();
      });
    }

    // State (d): Add fee to order note
    if (addFeeBtn) {
      addFeeBtn.addEventListener("click", function () {
        if (checkerState.status !== "served" || !checkerState.zone) {
          return;
        }

        var zone = checkerState.zone;
        var slot = deliverySlots.find(function (s) { return s.id === preferredSlotId; }) || deliverySlots[0];
        var feeText = zone.fee === 0 ? "Free (PKR 0)" : formatPKR(zone.fee);
        var noteLine = "[Delivery Estimate: " + zone.name + " — " + feeText + " | " + slot.label + "]";

        var messageInput = document.getElementById("contactMessage");
        var contactArea = document.getElementById("contactArea");

        if (contactArea) {
          contactArea.value = zone.name;
        }

        if (messageInput) {
          var existing = messageInput.value.trim();
          var cleaned = existing.replace(/\[Delivery Estimate:[^\]]*\]/g, "").trim();
          messageInput.value = cleaned ? cleaned + "\n" + noteLine : noteLine;
          messageInput.dispatchEvent(new Event("input"));
        }

        var saved = safeSet(
          DELIVERY_NOTE_KEY,
          JSON.stringify({
            zoneId: zone.id,
            zoneName: zone.name,
            fee: zone.fee,
            slot: slot.label,
            note: noteLine
          })
        );

        if (addFeeConfirm) {
          addFeeConfirm.textContent = saved
            ? 'Added "' + zone.name + " (" + feeText + ')" to your inquiry message and saved it to your order note.'
            : 'Added "' + zone.name + " (" + feeText + ')" to your inquiry message for this session.';
          addFeeConfirm.classList.remove("d-none");
        }
      });
    }

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

  function initContactForm() {
    var form = document.getElementById("contactForm");
    var nameInput = document.getElementById("contactName");
    var phoneInput = document.getElementById("contactPhone");
    var emailInput = document.getElementById("contactEmail");
    var topicSelect = document.getElementById("contactTopic");
    var areaSelect = document.getElementById("contactArea");
    var messageInput = document.getElementById("contactMessage");
    var feedback = document.getElementById("inquiryFeedback");
    var resetBtn = document.getElementById("resetContactFormBtn");
    var clearInquiriesBtn = document.getElementById("clearInquiriesBtn");

    var nameErr = document.getElementById("contactNameError");
    var phoneErr = document.getElementById("contactPhoneError");
    var emailErr = document.getElementById("contactEmailError");
    var topicErr = document.getElementById("contactTopicError");
    var messageErr = document.getElementById("contactMessageError");

    if (!form) {
      return;
    }

    // Restore saved draft from localStorage
    var draft = safeParseJSON(safeGet(CONTACT_DRAFT_KEY), null);
    if (draft) {
      if (draft.name) { nameInput.value = draft.name; }
      if (draft.phone) { phoneInput.value = draft.phone; }
      if (draft.email) { emailInput.value = draft.email; }
      if (draft.topic) { topicSelect.value = draft.topic; }
      if (draft.area) { areaSelect.value = draft.area; }
      if (draft.message) { messageInput.value = draft.message; }
    }

    function saveDraft() {
      safeSet(CONTACT_DRAFT_KEY, JSON.stringify({
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        topic: topicSelect.value,
        area: areaSelect.value,
        message: messageInput.value
      }));
    }

    [nameInput, phoneInput, emailInput, topicSelect, areaSelect, messageInput].forEach(function (field) {
      if (field) {
        field.addEventListener("input", saveDraft);
        field.addEventListener("change", saveDraft);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameVal = nameInput.value.trim();
      var phoneDigits = phoneInput.value.replace(/[\s\-()]/g, "");
      var emailVal = emailInput.value.trim();
      var topicVal = topicSelect.value.trim();
      var areaVal = areaSelect.value.trim() || "Unspecified area";
      var messageVal = messageInput.value.trim();

      var isValid = true;
      var firstInvalid = null;

      if (nameVal.length < 2) {
        setFieldError(nameInput, nameErr, "Please enter your full name (at least 2 characters).");
        isValid = false;
        firstInvalid = firstInvalid || nameInput;
      } else {
        setFieldError(nameInput, nameErr, "");
      }

      var phonePattern = /^(\+92|0)?3\d{9}$/;
      if (!phonePattern.test(phoneDigits)) {
        setFieldError(phoneInput, phoneErr, "Enter a valid Pakistani mobile number (e.g., 0300-1234567 or +923001234567).");
        isValid = false;
        firstInvalid = firstInvalid || phoneInput;
      } else {
        setFieldError(phoneInput, phoneErr, "");
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(emailVal)) {
        setFieldError(emailInput, emailErr, "Please enter a valid email address.");
        isValid = false;
        firstInvalid = firstInvalid || emailInput;
      } else {
        setFieldError(emailInput, emailErr, "");
      }

      if (!topicVal) {
        setFieldError(topicSelect, topicErr, "Please select an inquiry topic.");
        isValid = false;
        firstInvalid = firstInvalid || topicSelect;
      } else {
        setFieldError(topicSelect, topicErr, "");
      }

      if (messageVal.length < 12) {
        setFieldError(messageInput, messageErr, "Please share at least 12 characters so our baker can help you.");
        isValid = false;
        firstInvalid = firstInvalid || messageInput;
      } else {
        setFieldError(messageInput, messageErr, "");
      }

      if (!isValid) {
        if (feedback) {
          feedback.classList.add("d-none");
        }
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      var refCode = "TSO-INQ-" + Math.floor(1000 + Math.random() * 9000);
      var newInquiry = {
        ref: refCode,
        name: nameVal,
        phone: phoneInput.value.trim(),
        email: emailVal,
        topic: topicVal,
        area: areaVal,
        message: messageVal,
        submittedAt: new Date().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })
      };

      inquiryHistory.unshift(newInquiry);
      saveInquiries();
      renderInquiryHistory();

      safeRemove(CONTACT_DRAFT_KEY);
      form.reset();

      if (feedback) {
        feedback.textContent = "Thank you, " + nameVal + "! Inquiry " + refCode + " has been saved. Our F-8/3 kitchen desk responds within 2 hours during bakery hours.";
        feedback.classList.remove("d-none");
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        safeRemove(CONTACT_DRAFT_KEY);
        setFieldError(nameInput, nameErr, "");
        setFieldError(phoneInput, phoneErr, "");
        setFieldError(emailInput, emailErr, "");
        setFieldError(topicSelect, topicErr, "");
        setFieldError(messageInput, messageErr, "");
        if (feedback) {
          feedback.classList.add("d-none");
        }
      });
    }

    if (clearInquiriesBtn) {
      clearInquiriesBtn.addEventListener("click", function () {
        inquiryHistory = [];
        saveInquiries();
        renderInquiryHistory();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderContactChannels();
    populateSelects();
    renderDeliveryChecker();
    renderZoneFilterBar();
    renderDeliveryZones();
    renderGuidelines();
    renderInquiryHistory();
    initDeliveryCheckerEvents();
    initContactForm();
  });
})();
