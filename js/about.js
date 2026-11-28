(function () {
  "use strict";

  var DIETARY_STORAGE_KEY = "sweetOvenDietaryPrefs";
  var INGREDIENT_FILTER_KEY = "sweetOvenIngredientFilter";

  var bakerStats = [
    { value: "2021", label: "Year Founded in F-8/3" },
    { value: "1,850+", label: "Small-Batch Cakes Baked" },
    { value: "100%", label: "Real Butter & Pure Cocoa" },
    { value: "24 Hours", label: "Max Window From Oven to Door" }
  ];

  var storyMilestones = [
    {
      year: "2021 • The First Oven",
      title: "Weekend Fudge Cakes for Neighbours",
      description: "Hira Salman began baking single-tier Belgian chocolate fudge cakes and cinnamon rolls from a home kitchen in Sector F-8/3, Islamabad."
    },
    {
      year: "2023 • Signature Milk Tubs",
      title: "Lotus Biscoff Tres Leches Takes Off",
      description: "Inspired by family tea gatherings, our three-milk Biscoff family tub became a sell-out Friday tradition across Islamabad."
    },
    {
      year: "2024 • Chilled Van Dispatch",
      title: "Expanding to Rawalpindi & Bahria",
      description: "Added insulated cooler boxes and chilled van routes so frosted cakes reach Chaklala, DHA, and Bahria Town intact."
    },
    {
      year: "2026 • Group 10 Bakery Platform",
      title: "Seamless Online Ordering & Custom Slots",
      description: "Launched online basket management, custom cake inquiry slots, and transparent PKR sector delivery rates."
    }
  ];

  var qualityIngredients = [
    {
      name: "Callebaut 54.5% Belgian Dark Cocoa",
      category: "Dairy & Chocolate",
      origin: "Belgium Imported",
      detail: "Forms the glossy ganache and deep fudge crumb of our signature chocolate cakes and walnut brownies."
    },
    {
      name: "Cultured Unsalted Table Butter",
      category: "Dairy & Chocolate",
      origin: "Local Chilled Dairy",
      detail: "Used in every buttercream, brioche cinnamon roll, and laminated almond croissant instead of hydrogenated fats."
    },
    {
      name: "Unbleached Fine Pastry Flour",
      category: "Baking Craft",
      origin: "Stone-Milled",
      detail: "Gives our red velvet cupcakes and tres leches sponges an airy, tender crumb without chemical whiteners."
    },
    {
      name: "Ceylon Cinnamon & Madagascar Vanilla",
      category: "Baking Craft",
      origin: "Small-Batch Spice Pantry",
      detail: "Whole spices ground fresh each week for fragrant morning rolls and warm caramel drizzles."
    },
    {
      name: "Food-Grade Tamper-Safe Kraft Boxes",
      category: "Packaging",
      origin: "Recyclable Paperboard",
      detail: "Sturdy ribbon-sealed cake boxes and chilled milk-cake tubs designed to survive doorstep transit."
    },
    {
      name: "Insulated Cooler Transit Liners",
      category: "Packaging",
      origin: "Temperature Controlled",
      detail: "Protects cream-cheese frostings and three-milk tubs during Islamabad's warm afternoons."
    }
  ];

  var bakingSteps = [
    {
      step: "1",
      title: "Order Cutoff & Fresh Prep",
      description: "We confirm your slot and weigh farm eggs, cultured butter, and dark cocoa to order."
    },
    {
      step: "2",
      title: "Small-Batch Oven Bake",
      description: "Sponges, brownies, and brioche rolls are baked in numbered trays for even caramelisation."
    },
    {
      step: "3",
      title: "Hand Frosting & Cooling",
      description: "Cakes cool completely before receiving whipped cream-cheese or Belgian ganache finishes."
    },
    {
      step: "4",
      title: "Pickup or Chilled Dispatch",
      description: "Collect free from Street 14, F-8/3 or receive in your chosen morning, afternoon, or evening slot."
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

  var activeIngredientFilter = loadIngredientFilter();
  var savedDietaryPrefs = loadDietaryPrefs();

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

  function loadIngredientFilter() {
    var saved = safeGet(INGREDIENT_FILTER_KEY);
    return saved || "All";
  }

  function saveIngredientFilter(category) {
    safeSet(INGREDIENT_FILTER_KEY, category);
  }

  function loadDietaryPrefs() {
    var parsed = safeParseJSON(safeGet(DIETARY_STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveDietaryPrefs() {
    return safeSet(DIETARY_STORAGE_KEY, JSON.stringify(savedDietaryPrefs));
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

  function renderStats() {
    var grid = document.getElementById("bakerStatsGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    bakerStats.forEach(function (stat) {
      var col = createEl("div", "col-6 col-lg-3");
      var card = createEl("article", "card stat-card");
      var val = createEl("p", "stat-value mb-1", stat.value);
      var lbl = createEl("p", "text-muted-bakery fw-bold small mb-0", stat.label);

      card.appendChild(val);
      card.appendChild(lbl);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderTimeline() {
    var grid = document.getElementById("storyTimelineGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    storyMilestones.forEach(function (item) {
      var col = createEl("div", "col-md-6");
      var card = createEl("article", "card timeline-card card-hover");
      var year = createEl("span", "timeline-year", item.year);
      var title = createEl("h3", "h5 mb-2", item.title);
      var desc = createEl("p", "text-muted-bakery mb-0", item.description);

      card.appendChild(year);
      card.appendChild(title);
      card.appendChild(desc);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function getIngredientCategories() {
    var categories = ["All"];
    qualityIngredients.forEach(function (item) {
      if (categories.indexOf(item.category) === -1) {
        categories.push(item.category);
      }
    });
    return categories;
  }

  function renderIngredientFilters() {
    var bar = document.getElementById("ingredientFilterBar");
    if (!bar) {
      return;
    }
    bar.innerHTML = "";

    var categories = getIngredientCategories();
    if (categories.indexOf(activeIngredientFilter) === -1) {
      activeIngredientFilter = "All";
    }

    categories.forEach(function (category) {
      var btn = createEl(
        "button",
        "ingredient-filter-btn" + (activeIngredientFilter === category ? " is-active" : ""),
        category
      );
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(activeIngredientFilter === category));
      btn.addEventListener("click", function () {
        activeIngredientFilter = category;
        saveIngredientFilter(category);
        renderIngredientFilters();
        renderIngredients();
      });
      bar.appendChild(btn);
    });
  }

  function renderIngredients() {
    var grid = document.getElementById("ingredientsGrid");
    var emptyState = document.getElementById("ingredientsEmptyState");
    if (!grid || !emptyState) {
      return;
    }
    grid.innerHTML = "";

    var filtered = qualityIngredients.filter(function (item) {
      return activeIngredientFilter === "All" || item.category === activeIngredientFilter;
    });

    if (filtered.length === 0) {
      emptyState.classList.remove("d-none");
      return;
    }
    emptyState.classList.add("d-none");

    filtered.forEach(function (item) {
      var col = createEl("div", "col-md-6 col-lg-4");
      var card = createEl("article", "card ingredient-card card-hover");
      var origin = createEl("p", "ingredient-origin mb-1", item.category + " • " + item.origin);
      var title = createEl("h3", "h5 mb-2", item.name);
      var detail = createEl("p", "text-muted-bakery small mb-0", item.detail);

      card.appendChild(origin);
      card.appendChild(title);
      card.appendChild(detail);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function renderBakingSteps() {
    var grid = document.getElementById("bakingStepsGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";

    bakingSteps.forEach(function (item) {
      var col = createEl("div", "col-sm-6 col-lg-3");
      var card = createEl("article", "card step-card");
      var num = createEl("span", "step-number", item.step);
      var title = createEl("h3", "h5 mb-2", item.title);
      var desc = createEl("p", "text-muted-bakery small mb-0", item.description);

      card.appendChild(num);
      card.appendChild(title);
      card.appendChild(desc);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  function showDietaryBanner(message) {
    var banner = document.getElementById("dietarySavedBanner");
    if (!banner) {
      return;
    }
    banner.textContent = message;
    banner.classList.remove("d-none");
  }

  function renderDietaryPrefs() {
    var list = document.getElementById("savedDietaryList");
    var empty = document.getElementById("emptyDietaryState");
    if (!list || !empty) {
      return;
    }

    list.innerHTML = "";

    if (savedDietaryPrefs.length === 0) {
      empty.classList.remove("d-none");
      return;
    }

    empty.classList.add("d-none");

    savedDietaryPrefs.forEach(function (pref, index) {
      var chip = createEl("span", "dietary-chip");
      chip.appendChild(createEl("span", "", pref));

      var removeBtn = createEl("button", "btn btn-sm p-0 border-0 bg-transparent dietary-remove-btn", "×");
      removeBtn.type = "button";
      removeBtn.setAttribute("aria-label", "Remove " + pref);
      removeBtn.addEventListener("click", function () {
        savedDietaryPrefs.splice(index, 1);
        saveDietaryPrefs();
        renderDietaryPrefs();
        showDietaryBanner("Removed kitchen preference: " + pref);
      });

      chip.appendChild(removeBtn);
      list.appendChild(chip);
    });
  }

  function initDietaryForm() {
    var form = document.getElementById("dietaryForm");
    var select = document.getElementById("dietarySelect");
    var customInput = document.getElementById("customDietaryInput");
    var errorEl = document.getElementById("dietaryError");
    var clearBtn = document.getElementById("clearDietaryBtn");
    var resetFilterBtn = document.getElementById("resetIngredientFilterBtn");

    if (errorEl) {
      errorEl.className = "field-error-msg mb-2 d-none";
    }

    if (resetFilterBtn) {
      resetFilterBtn.addEventListener("click", function () {
        activeIngredientFilter = "All";
        saveIngredientFilter("All");
        renderIngredientFilters();
        renderIngredients();
      });
    }

    if (!form || !select || !customInput) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var chosen = customInput.value.trim() || select.value.trim();

      if (!chosen) {
        errorEl.textContent = "Please choose a standard request or type a custom kitchen note.";
        errorEl.classList.remove("d-none");
        select.focus();
        return;
      }

      if (chosen.length < 4) {
        errorEl.textContent = "Kitchen notes should be at least 4 characters long.";
        errorEl.classList.remove("d-none");
        customInput.focus();
        return;
      }

      var exists = savedDietaryPrefs.some(function (entry) {
        return entry.toLowerCase() === chosen.toLowerCase();
      });

      if (exists) {
        errorEl.textContent = '"' + chosen + '" is already saved in your kitchen notes.';
        errorEl.classList.remove("d-none");
        return;
      }

      errorEl.classList.add("d-none");
      savedDietaryPrefs.push(chosen);
      var persisted = saveDietaryPrefs();
      renderDietaryPrefs();
      showDietaryBanner(
        persisted
          ? "Saved kitchen note for future visits: " + chosen
          : "Added kitchen note for this session (browser storage unavailable): " + chosen
      );

      select.value = "";
      customInput.value = "";
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        savedDietaryPrefs = [];
        saveDietaryPrefs();
        renderDietaryPrefs();
        if (errorEl) {
          errorEl.classList.add("d-none");
        }
        showDietaryBanner("Cleared all saved kitchen notes.");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderStats();
    renderTimeline();
    renderIngredientFilters();
    renderIngredients();
    renderBakingSteps();
    renderDietaryPrefs();
    initDietaryForm();
  });
})();
