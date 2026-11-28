(function () {
  "use strict";

  var RECENT_ITEMS_KEY = "sweetOvenRecentItems";
  var LAST_ITEM_KEY = "sweetOvenLastViewedItem";
  var ITEM_NOTES_KEY = "sweetOvenItemNotes";

  var data = window.SweetOvenData;
  var shared = window.SweetOvenShared;

  if (!data || !shared) {
    return;
  }

  var ASSURANCE_POINTS = [
    "Baked fresh to order in our Islamabad home kitchen",
    "100% halal dairy butter, couverture chocolate, and pure vanilla",
    "Packed in insulated cake boxes for safe delivery or pickup"
  ];

  var params = new URLSearchParams(window.location.search);
  var requestedId = params.get("id");

  var itemNotFound = document.getElementById("itemNotFound");
  var notFoundMessage = document.getElementById("notFoundMessage");
  var itemDetailContent = document.getElementById("itemDetailContent");
  var breadcrumbItemName = document.getElementById("breadcrumbItemName");
  var detailFeedback = document.getElementById("detailFeedback");

  var detailBadge = document.getElementById("detailBadge");
  var detailFavoriteBtn = document.getElementById("detailFavoriteBtn");
  var detailImage = document.getElementById("detailImage");
  var detailHighlightsList = document.getElementById("detailHighlightsList");
  var detailCategory = document.getElementById("detailCategory");
  var detailRatingText = document.getElementById("detailRatingText");
  var detailTitle = document.getElementById("detailTitle");
  var detailShortDesc = document.getElementById("detailShortDesc");
  var detailDescription = document.getElementById("detailDescription");
  var detailUnitPrice = document.getElementById("detailUnitPrice");
  var detailPrepTime = document.getElementById("detailPrepTime");
  var variantList = document.getElementById("variantList");

  var detailOrderForm = document.getElementById("detailOrderForm");
  var qtyDecreaseBtn = document.getElementById("qtyDecreaseBtn");
  var qtyIncreaseBtn = document.getElementById("qtyIncreaseBtn");
  var detailQtyInput = document.getElementById("detailQtyInput");
  var qtyErrorMsg = document.getElementById("qtyErrorMsg");
  var detailNoteInput = document.getElementById("detailNoteInput");
  var noteCharCount = document.getElementById("noteCharCount");
  var detailSubtotal = document.getElementById("detailSubtotal");

  var detailIngredientsList = document.getElementById("detailIngredientsList");
  var detailAllergensBadges = document.getElementById("detailAllergensBadges");
  var detailAllergensList = document.getElementById("detailAllergensList");
  var detailAllergenNote = document.getElementById("detailAllergenNote");
  var detailBakerNote = document.getElementById("detailBakerNote");
  var detailStorage = document.getElementById("detailStorage");
  var relatedItemsGrid = document.getElementById("relatedItemsGrid");
  var recentSection = document.getElementById("recentSection");
  var recentItemsList = document.getElementById("recentItemsList");

  var tabButtons = document.querySelectorAll("[data-tab]");
  var tabPanels = {
    ingredients: document.getElementById("panel-ingredients"),
    allergens: document.getElementById("panel-allergens"),
    storage: document.getElementById("panel-storage")
  };

  // Allergen & Details Modal
  var openAllergenModalBtn = document.getElementById("openAllergenModalBtn");
  var allergenModal = document.getElementById("allergenModal");
  var closeAllergenModalBtn = document.getElementById("closeAllergenModalBtn");
  var confirmAllergenModalBtn = document.getElementById("confirmAllergenModalBtn");
  var allergenModalTitle = document.getElementById("allergenModalTitle");
  var allergenModalBadges = document.getElementById("allergenModalBadges");
  var allergenModalNote = document.getElementById("allergenModalNote");
  var allergenModalIngredients = document.getElementById("allergenModalIngredients");
  var allergenModalStorage = document.getElementById("allergenModalStorage");

  var currentItem = resolveInitialItem(requestedId);
  var selectedVariantIndex = 0;
  var lastFocusedBeforeModal = null;

  function formatRs(amount) {
    return data.formatRs ? data.formatRs(amount) : shared.formatPKR(amount);
  }

  function formatReviews(count) {
    return data.formatReviews ? data.formatReviews(count) : count + " reviews";
  }

  function resolveInitialItem(urlId) {
    if (urlId !== null) {
      var trimmed = urlId.trim();
      if (!trimmed) {
        return null;
      }
      return data.getItemById(trimmed);
    }
    try {
      var lastId = localStorage.getItem(LAST_ITEM_KEY);
      if (lastId) {
        var found = data.getItemById(lastId);
        if (found) {
          return found;
        }
      }
    } catch (err) {
      // Ignore storage error
    }
    return data.MENU_ITEMS[0] || null;
  }

  function showFeedback(message, showCartLink, isError) {
    detailFeedback.innerHTML = "";
    detailFeedback.classList.remove("d-none", "is-error");
    if (isError) {
      detailFeedback.classList.add("is-error");
    }

    var msg = document.createElement("span");
    msg.className = "fw-semibold";
    msg.textContent = message;
    detailFeedback.appendChild(msg);

    if (showCartLink) {
      var link = document.createElement("a");
      link.href = "cart.html";
      link.className = "btn btn-sm btn-pink";
      link.textContent = "Go to Cart";
      detailFeedback.appendChild(link);
    }
  }

  function loadRecentIds() {
    try {
      var raw = localStorage.getItem(RECENT_ITEMS_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (err) {
      return [];
    }
  }

  function recordRecentItem(itemId) {
    try {
      localStorage.setItem(LAST_ITEM_KEY, itemId);
      var recent = loadRecentIds().filter(function (id) {
        return id !== itemId;
      });
      recent.unshift(itemId);
      if (recent.length > 5) {
        recent = recent.slice(0, 5);
      }
      localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(recent));
    } catch (err) {
      // Ignore storage error
    }
  }

  function loadSavedNote(itemId) {
    try {
      var raw = localStorage.getItem(ITEM_NOTES_KEY);
      if (!raw) {
        return "";
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed[itemId] === "string" ? parsed[itemId] : "";
    } catch (err) {
      return "";
    }
  }

  function saveNote(itemId, noteText) {
    try {
      var raw = localStorage.getItem(ITEM_NOTES_KEY);
      var notes = raw ? JSON.parse(raw) : {};
      if (!notes || typeof notes !== "object") {
        notes = {};
      }
      if (noteText) {
        notes[itemId] = noteText;
      } else {
        delete notes[itemId];
      }
      localStorage.setItem(ITEM_NOTES_KEY, JSON.stringify(notes));
    } catch (err) {
      // Ignore storage error
    }
  }

  function getSelectedVariant() {
    if (!currentItem || !currentItem.variants || currentItem.variants.length === 0) {
      return { id: "default", label: currentItem.weight, price: currentItem.price, note: "" };
    }
    return currentItem.variants[selectedVariantIndex] || currentItem.variants[0];
  }

  function validateQuantity() {
    var raw = String(detailQtyInput.value).trim();
    if (!/^\d+$/.test(raw)) {
      qtyErrorMsg.textContent = "Please enter a whole number between 1 and " + shared.MAX_ITEM_QTY + ".";
      detailQtyInput.classList.add("is-invalid");
      return null;
    }
    var qty = parseInt(raw, 10);
    if (qty < 1 || qty > shared.MAX_ITEM_QTY) {
      qtyErrorMsg.textContent = "Quantity must be between 1 and " + shared.MAX_ITEM_QTY + ".";
      detailQtyInput.classList.add("is-invalid");
      return null;
    }
    qtyErrorMsg.textContent = "";
    detailQtyInput.classList.remove("is-invalid");
    return qty;
  }

  function updatePricing() {
    var variant = getSelectedVariant();
    detailUnitPrice.textContent = formatRs(variant.price);

    var qty = validateQuantity();
    var displayQty = qty !== null ? qty : 1;
    detailSubtotal.textContent = formatRs(variant.price * displayQty);

    qtyDecreaseBtn.disabled = displayQty <= 1;
    qtyIncreaseBtn.disabled = displayQty >= shared.MAX_ITEM_QTY;
  }

  function renderVariants() {
    variantList.innerHTML = "";
    var variants = currentItem.variants && currentItem.variants.length
      ? currentItem.variants
      : [{ id: "default", label: currentItem.weight, price: currentItem.price, note: "" }];

    for (var i = 0; i < variants.length; i += 1) {
      var v = variants[i];
      var col = document.createElement("div");
      col.className = "col-sm-6";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "variant-option-btn" + (i === selectedVariantIndex ? " is-selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", i === selectedVariantIndex ? "true" : "false");
      btn.setAttribute("data-variant-index", String(i));

      var top = document.createElement("div");
      top.className = "d-flex justify-content-between align-items-center gap-2";

      var labelSpan = document.createElement("strong");
      labelSpan.textContent = v.label;

      var priceSpan = document.createElement("span");
      priceSpan.className = "fw-bold";
      priceSpan.textContent = formatRs(v.price);

      top.appendChild(labelSpan);
      top.appendChild(priceSpan);
      btn.appendChild(top);

      if (v.note) {
        var noteSpan = document.createElement("small");
        noteSpan.className = "d-block text-muted-bakery mt-1";
        noteSpan.textContent = v.note;
        btn.appendChild(noteSpan);
      }

      col.appendChild(btn);
      variantList.appendChild(col);
    }
  }

  function updateFavoriteButton() {
    var fav = shared.isFavorite(currentItem.id);
    detailFavoriteBtn.classList.toggle("is-favorite", fav);
    detailFavoriteBtn.setAttribute("aria-pressed", fav ? "true" : "false");
    detailFavoriteBtn.setAttribute("aria-label", (fav ? "Remove " : "Save ") + currentItem.name + " to favourites");
    detailFavoriteBtn.textContent = fav ? "♥" : "♡";
  }

  function renderStringList(ulElement, items) {
    ulElement.innerHTML = "";
    for (var i = 0; i < items.length; i += 1) {
      var li = document.createElement("li");
      li.textContent = items[i];
      ulElement.appendChild(li);
    }
  }

  function renderAllergenBadges(container, item) {
    container.innerHTML = "";
    for (var i = 0; i < item.allergens.length; i += 1) {
      var badge = document.createElement("span");
      badge.className = "allergen-badge";
      badge.textContent = item.allergens[i];
      container.appendChild(badge);
    }
    if (item.dietary.indexOf("nut-free") !== -1) {
      var nf = document.createElement("span");
      nf.className = "badge badge-pink rounded-pill px-3 py-2";
      nf.textContent = "Nut-Free Recipe";
      container.appendChild(nf);
    }
    if (item.dietary.indexOf("eggless-option") !== -1) {
      var eg = document.createElement("span");
      eg.className = "badge badge-pink rounded-pill px-3 py-2";
      eg.textContent = "Eggless Option Available";
      container.appendChild(eg);
    }
  }

  function activateTab(tabName) {
    for (var i = 0; i < tabButtons.length; i += 1) {
      var btn = tabButtons[i];
      var isCurrent = btn.getAttribute("data-tab") === tabName;
      btn.classList.toggle("is-active", isCurrent);
      btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
    }
    Object.keys(tabPanels).forEach(function (key) {
      if (tabPanels[key]) {
        tabPanels[key].classList.toggle("d-none", key !== tabName);
      }
    });
  }

  function renderRelatedItems() {
    relatedItemsGrid.innerHTML = "";
    var related = data.MENU_ITEMS.filter(function (item) {
      return item.id !== currentItem.id;
    }).sort(function (a, b) {
      var aSame = a.category === currentItem.category ? 1 : 0;
      var bSame = b.category === currentItem.category ? 1 : 0;
      return bSame - aSame || b.rating - a.rating;
    }).slice(0, 3);

    for (var i = 0; i < related.length; i += 1) {
      var item = related[i];
      var col = document.createElement("div");
      col.className = "col-12 col-md-4";

      var cardLink = document.createElement("a");
      cardLink.href = "item-details.html?id=" + encodeURIComponent(item.id);
      cardLink.className = "card bakery-card card-hover like-thumb-card h-100";

      var thumbBox = document.createElement("div");
      thumbBox.className = "like-thumb-box";

      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt;
      img.className = "like-thumb-img";
      img.width = 76;
      img.height = 76;
      thumbBox.appendChild(img);

      var info = document.createElement("div");
      info.className = "d-flex flex-column";

      var title = document.createElement("strong");
      title.className = "mb-1";
      title.textContent = item.name;

      var price = document.createElement("span");
      price.className = "small fw-bold";
      price.style.color = "#C23B5A";
      price.textContent = formatRs(item.price);

      info.appendChild(title);
      info.appendChild(price);

      cardLink.appendChild(thumbBox);
      cardLink.appendChild(info);
      col.appendChild(cardLink);
      relatedItemsGrid.appendChild(col);
    }
  }

  function renderRecentItems() {
    var recentIds = loadRecentIds().filter(function (id) {
      return id !== currentItem.id;
    });
    var recentItems = recentIds.map(data.getItemById).filter(Boolean).slice(0, 3);

    if (recentItems.length === 0) {
      recentSection.classList.add("d-none");
      return;
    }

    recentSection.classList.remove("d-none");
    recentItemsList.innerHTML = "";

    for (var i = 0; i < recentItems.length; i += 1) {
      var item = recentItems[i];
      var col = document.createElement("div");
      col.className = "col-12 col-md-4";

      var linkCard = document.createElement("a");
      linkCard.href = "item-details.html?id=" + encodeURIComponent(item.id);
      linkCard.className = "card p-3 text-decoration-none d-flex flex-row align-items-center gap-3 card-hover";

      var thumb = document.createElement("img");
      thumb.src = item.image;
      thumb.alt = item.alt;
      thumb.width = 64;
      thumb.height = 48;

      var info = document.createElement("div");
      var nameEl = document.createElement("strong");
      nameEl.className = "d-block text-dark";
      nameEl.textContent = item.name;
      var priceEl = document.createElement("small");
      priceEl.className = "text-muted-bakery";
      priceEl.textContent = formatRs(item.price);

      info.appendChild(nameEl);
      info.appendChild(priceEl);
      linkCard.appendChild(thumb);
      linkCard.appendChild(info);
      col.appendChild(linkCard);
      recentItemsList.appendChild(col);
    }
  }

  function openAllergenModal() {
    if (!allergenModal || !currentItem) {
      return;
    }
    lastFocusedBeforeModal = document.activeElement;
    allergenModalTitle.textContent = currentItem.name + " — Allergens & Details";
    renderAllergenBadges(allergenModalBadges, currentItem);
    allergenModalNote.textContent = currentItem.allergenNote || "Prepared in a home kitchen that handles dairy, wheat, eggs, and tree nuts.";
    renderStringList(allergenModalIngredients, currentItem.ingredients);
    allergenModalStorage.textContent = currentItem.bakerNote + " Storage: " + currentItem.storage;

    allergenModal.classList.remove("d-none");
    allergenModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeAllergenModalBtn.focus();
  }

  function closeAllergenModal() {
    if (!allergenModal || allergenModal.classList.contains("d-none")) {
      return;
    }
    allergenModal.classList.add("d-none");
    allergenModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
      lastFocusedBeforeModal.focus();
    }
  }

  function renderPage() {
    if (!currentItem) {
      itemDetailContent.classList.add("d-none");
      itemNotFound.classList.remove("d-none");
      breadcrumbItemName.textContent = "Not Found";
      if (requestedId) {
        notFoundMessage.textContent = "No bakery item was found for \"" + requestedId + "\". Please explore our fresh menu below.";
      }
      document.title = "Item Not Found | The Sweet Oven";
      return;
    }

    itemNotFound.classList.add("d-none");
    itemDetailContent.classList.remove("d-none");

    document.title = currentItem.name + " | The Sweet Oven";
    breadcrumbItemName.textContent = currentItem.name;

    detailImage.src = currentItem.image;
    detailImage.alt = currentItem.alt;
    detailCategory.textContent = currentItem.category;
    detailRatingText.textContent = currentItem.rating.toFixed(1) + " (" + formatReviews(currentItem.reviewCount) + ")";
    detailTitle.textContent = currentItem.name;
    detailShortDesc.textContent = currentItem.shortDescription;
    detailDescription.textContent = currentItem.description;
    detailPrepTime.textContent = "Ready: " + currentItem.prepTime;
    detailBakerNote.textContent = currentItem.bakerNote;
    detailStorage.textContent = currentItem.storage;
    detailAllergenNote.textContent = currentItem.allergenNote || "Prepared in a home kitchen that handles dairy, wheat, eggs, and tree nuts.";

    if (currentItem.badge) {
      detailBadge.textContent = currentItem.badge;
      detailBadge.classList.remove("d-none");
    } else {
      detailBadge.classList.add("d-none");
    }

    renderStringList(detailHighlightsList, ASSURANCE_POINTS);
    renderStringList(detailIngredientsList, currentItem.ingredients);
    renderStringList(detailAllergensList, currentItem.allergens);
    renderAllergenBadges(detailAllergensBadges, currentItem);

    var savedNote = loadSavedNote(currentItem.id);
    detailNoteInput.value = savedNote;
    noteCharCount.textContent = String(savedNote.length);

    updateFavoriteButton();
    renderVariants();
    updatePricing();
    activateTab("ingredients");
    renderRelatedItems();
    recordRecentItem(currentItem.id);
    renderRecentItems();
  }

  variantList.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-variant-index]");
    if (!btn) {
      return;
    }
    var idx = parseInt(btn.getAttribute("data-variant-index"), 10);
    if (!Number.isInteger(idx)) {
      return;
    }
    selectedVariantIndex = idx;
    renderVariants();
    updatePricing();
  });

  qtyDecreaseBtn.addEventListener("click", function () {
    var qty = validateQuantity() || 1;
    if (qty > 1) {
      detailQtyInput.value = String(qty - 1);
      updatePricing();
    }
  });

  qtyIncreaseBtn.addEventListener("click", function () {
    var qty = validateQuantity() || 1;
    if (qty < shared.MAX_ITEM_QTY) {
      detailQtyInput.value = String(qty + 1);
      updatePricing();
    }
  });

  detailQtyInput.addEventListener("input", updatePricing);

  detailNoteInput.addEventListener("input", function () {
    var text = detailNoteInput.value;
    noteCharCount.textContent = String(text.length);
    if (currentItem) {
      saveNote(currentItem.id, text);
    }
  });

  detailFavoriteBtn.addEventListener("click", function () {
    if (!currentItem) {
      return;
    }
    var saved = shared.toggleFavorite(currentItem.id);
    updateFavoriteButton();
    showFeedback(
      saved ? "Saved " + currentItem.name + " to your favourites." : "Removed " + currentItem.name + " from your favourites.",
      false,
      false
    );
  });

  for (var t = 0; t < tabButtons.length; t += 1) {
    tabButtons[t].addEventListener("click", function () {
      activateTab(this.getAttribute("data-tab"));
    });
  }

  if (openAllergenModalBtn && allergenModal) {
    openAllergenModalBtn.addEventListener("click", openAllergenModal);
    closeAllergenModalBtn.addEventListener("click", closeAllergenModal);
    confirmAllergenModalBtn.addEventListener("click", closeAllergenModal);
    allergenModal.addEventListener("click", function (event) {
      if (event.target === allergenModal) {
        closeAllergenModal();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !allergenModal.classList.contains("d-none")) {
        closeAllergenModal();
      }
    });
  }

  detailOrderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!currentItem) {
      return;
    }
    var qty = validateQuantity();
    if (qty === null) {
      showFeedback("Please enter a valid quantity between 1 and " + shared.MAX_ITEM_QTY + ".", false, true);
      detailQtyInput.focus();
      return;
    }

    var variant = getSelectedVariant();
    var cartItemId = variant.id === "default" ? currentItem.id : currentItem.id + "-" + variant.id;
    var note = detailNoteInput.value.trim();
    var weightLabel = note ? variant.label + " (Note: " + note + ")" : variant.label;

    var result = shared.addToCart({
      id: cartItemId,
      name: currentItem.name,
      category: currentItem.category,
      weight: weightLabel,
      price: variant.price,
      quantity: qty,
      image: currentItem.image,
      alt: currentItem.alt
    });

    showFeedback(result.message, result.ok, !result.ok);
  });

  renderPage();
})();
