/**
 * The Sweet Oven - Party Calculator
 * Calculates recommended bakery quantities & PKR estimates with localStorage persistence.
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    FORM_STATE: 'sweetOvenPartyFormState',
    SAVED_PLANS: 'sweetOvenSavedPartyPlans',
    CART: 'sweetOvenCart'
  };

  const OCCASION_PRESETS = [
    {
      id: 'birthday',
      label: 'Birthday Party',
      advice: 'Tip: A custom celebration cake paired with cupcakes makes serving effortless.',
      recommendedItems: ['cake-fudge', 'cupcakes-redvelvet', 'brownies-caramel']
    },
    {
      id: 'mehndi',
      label: 'Mehndi / Dholki',
      advice: 'Tip: Bite-sized brownies, tres leches, and puffs keep guests mingling comfortably.',
      recommendedItems: ['tres-leches-lotus', 'brownies-caramel', 'puffs-chicken']
    },
    {
      id: 'hitea',
      label: 'Office Hi-Tea',
      advice: 'Tip: Balance sweet pastries with savoury chicken puffs for afternoon meetings.',
      recommendedItems: ['croissants-almond', 'cinnamon-rolls', 'puffs-chicken']
    },
    {
      id: 'dinner',
      label: 'Family Dinner',
      advice: 'Tip: Chilled Lotus Tres Leches or a fudge cake works great after a warm meal.',
      recommendedItems: ['tres-leches-lotus', 'cake-fudge']
    },
    {
      id: 'shower',
      label: 'Bridal / Baby Shower',
      advice: 'Tip: Red velvet cupcakes and almond croissants pair beautifully with pink-themed tables.',
      recommendedItems: ['cupcakes-redvelvet', 'croissants-almond', 'cake-fudge']
    }
  ];

  const PARTY_ITEMS = [
    {
      id: 'cake-fudge',
      name: 'Belgian Chocolate Fudge Cake',
      unitLabel: 'lb',
      servingsPerUnit: 4,
      pricePerUnit: 1650,
      category: 'Celebration Cake',
      minUnits: 2
    },
    {
      id: 'cupcakes-redvelvet',
      name: 'Red Velvet Cupcakes (Box of 6)',
      unitLabel: 'box',
      servingsPerUnit: 6,
      pricePerUnit: 1350,
      category: 'Cupcakes',
      minUnits: 1
    },
    {
      id: 'brownies-caramel',
      name: 'Caramel Walnut Brownies (Box of 6)',
      unitLabel: 'box',
      servingsPerUnit: 6,
      pricePerUnit: 1200,
      category: 'Brownies',
      minUnits: 1
    },
    {
      id: 'tres-leches-lotus',
      name: 'Lotus Biscoff Tres Leches Tray',
      unitLabel: 'tray',
      servingsPerUnit: 10,
      pricePerUnit: 3200,
      category: 'Chilled Dessert',
      minUnits: 1
    },
    {
      id: 'croissants-almond',
      name: 'Butter Almond Croissants (Box of 4)',
      unitLabel: 'box',
      servingsPerUnit: 4,
      pricePerUnit: 1150,
      category: 'Pastries',
      minUnits: 1
    },
    {
      id: 'cinnamon-rolls',
      name: 'Classic Cinnamon Rolls (Box of 4)',
      unitLabel: 'box',
      servingsPerUnit: 4,
      pricePerUnit: 1100,
      category: 'Pastries',
      minUnits: 1
    },
    {
      id: 'puffs-chicken',
      name: 'Savoury Chicken & Herb Puffs (Dozen)',
      unitLabel: 'dozen',
      servingsPerUnit: 12,
      pricePerUnit: 1450,
      category: 'Savoury',
      minUnits: 1
    }
  ];

  const STYLE_MULTIPLIER = {
    light: 0.85,
    standard: 1.0,
    generous: 1.3
  };

  let formState = {
    guests: 20,
    occasion: 'birthday',
    style: 'standard',
    budget: '',
    selectedIds: ['cake-fudge', 'cupcakes-redvelvet', 'brownies-caramel']
  };

  function formatPKR(amount) {
    return 'PKR ' + Math.round(amount).toLocaleString('en-PK');
  }

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Ignore storage errors
    }
  }

  function updateNavCartBadge() {
    const badge = document.getElementById('navCartBadge');
    if (!badge) return;
    const cart = readStorage(STORAGE_KEYS.CART, []);
    const totalQty = Array.isArray(cart)
      ? cart.reduce(function (sum, item) { return sum + (Number(item.quantity) || 1); }, 0)
      : 0;
    badge.textContent = String(totalQty);
  }

  function showBanner(message) {
    const banner = document.getElementById('calcFeedbackBanner');
    if (!banner) return;
    banner.textContent = message;
    banner.classList.remove('d-none');
  }

  function renderOccasionOptions() {
    const select = document.getElementById('occasionSelect');
    if (!select) return;
    select.innerHTML = '';

    OCCASION_PRESETS.forEach(function (preset) {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = preset.label;
      select.appendChild(option);
    });
    select.value = formState.occasion;
  }

  function renderItemCheckboxes() {
    const container = document.getElementById('partyItemsList');
    if (!container) return;
    container.innerHTML = '';

    PARTY_ITEMS.forEach(function (item) {
      const isChecked = formState.selectedIds.indexOf(item.id) !== -1;
      const col = document.createElement('div');
      col.className = 'col-sm-6';

      const label = document.createElement('label');
      label.className = 'party-item-option' + (isChecked ? ' is-selected' : '');
      label.setAttribute('for', 'item-' + item.id);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'item-' + item.id;
      checkbox.className = 'form-check-input mt-1 flex-shrink-0';
      checkbox.checked = isChecked;

      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          if (formState.selectedIds.indexOf(item.id) === -1) {
            formState.selectedIds.push(item.id);
          }
          label.classList.add('is-selected');
        } else {
          formState.selectedIds = formState.selectedIds.filter(function (id) { return id !== item.id; });
          label.classList.remove('is-selected');
        }
        saveAndCalculate();
      });

      const textWrap = document.createElement('span');
      textWrap.innerHTML =
        '<span class="d-block fw-bold">' + item.name + '</span>' +
        '<span class="d-block small text-muted-bakery">' + formatPKR(item.pricePerUnit) + ' / ' + item.unitLabel +
        ' &bull; ~' + item.servingsPerUnit + ' servings</span>';

      label.appendChild(checkbox);
      label.appendChild(textWrap);
      col.appendChild(label);
      container.appendChild(col);
    });
  }

  function validateInputs() {
    const guestInput = document.getElementById('guestCount');
    const guestError = document.getElementById('guestCountError');
    const budgetInput = document.getElementById('budgetTarget');
    const budgetError = document.getElementById('budgetError');
    const noItemsError = document.getElementById('noItemsError');

    let isValid = true;

    const rawGuests = guestInput ? guestInput.value.trim() : '';
    const guestsNum = Number(rawGuests);

    if (rawGuests === '' || isNaN(guestsNum) || !Number.isInteger(guestsNum) || guestsNum < 5 || guestsNum > 500) {
      if (guestError) {
        guestError.textContent = 'Please enter a whole number of guests between 5 and 500.';
        guestError.classList.remove('d-none');
      }
      if (guestInput) guestInput.classList.add('is-invalid');
      isValid = false;
    } else {
      if (guestError) guestError.classList.add('d-none');
      if (guestInput) guestInput.classList.remove('is-invalid');
      formState.guests = guestsNum;
    }

    const rawBudget = budgetInput ? budgetInput.value.trim() : '';
    if (rawBudget !== '') {
      const budgetNum = Number(rawBudget);
      if (isNaN(budgetNum) || budgetNum <= 0) {
        if (budgetError) {
          budgetError.textContent = 'Budget must be a positive amount in PKR (or leave blank).';
          budgetError.classList.remove('d-none');
        }
        if (budgetInput) budgetInput.classList.add('is-invalid');
        isValid = false;
      } else {
        if (budgetError) budgetError.classList.add('d-none');
        if (budgetInput) budgetInput.classList.remove('is-invalid');
        formState.budget = rawBudget;
      }
    } else {
      if (budgetError) budgetError.classList.add('d-none');
      if (budgetInput) budgetInput.classList.remove('is-invalid');
      formState.budget = '';
    }

    if (formState.selectedIds.length === 0) {
      if (noItemsError) noItemsError.classList.remove('d-none');
      isValid = false;
    } else {
      if (noItemsError) noItemsError.classList.add('d-none');
    }

    return isValid;
  }

  function calculateBreakdown() {
    const multiplier = STYLE_MULTIPLIER[formState.style] || 1.0;
    const selectedItems = PARTY_ITEMS.filter(function (item) {
      return formState.selectedIds.indexOf(item.id) !== -1;
    });

    // Share appetite across selected items so total portions match guest count sensibly
    const varietyFactor = selectedItems.length > 1 ? (1 / Math.sqrt(selectedItems.length)) * 1.15 : 1;
    const effectiveGuests = formState.guests * multiplier * varietyFactor;

    return selectedItems.map(function (item) {
      const rawUnits = Math.ceil(effectiveGuests / item.servingsPerUnit);
      const units = Math.max(item.minUnits, rawUnits);
      const subtotal = units * item.pricePerUnit;
      return {
        item: item,
        units: units,
        subtotal: subtotal
      };
    });
  }

  function renderEstimate() {
    const emptyState = document.getElementById('estimateEmptyState');
    const resultsWrap = document.getElementById('estimateResults');
    const occasionBadge = document.getElementById('summaryOccasionBadge');
    const adviceEl = document.getElementById('occasionAdvice');
    const breakdownEl = document.getElementById('estimateBreakdown');
    const totalEl = document.getElementById('totalEstimatePrice');
    const perGuestEl = document.getElementById('perGuestPrice');
    const budgetRow = document.getElementById('budgetStatusRow');
    const budgetStatusText = document.getElementById('budgetStatusText');

    const preset = OCCASION_PRESETS.find(function (p) { return p.id === formState.occasion; }) || OCCASION_PRESETS[0];
    if (occasionBadge) occasionBadge.textContent = preset.label;

    if (!validateInputs()) {
      if (emptyState) emptyState.classList.remove('d-none');
      if (resultsWrap) resultsWrap.classList.add('d-none');
      return null;
    }

    if (emptyState) emptyState.classList.add('d-none');
    if (resultsWrap) resultsWrap.classList.remove('d-none');
    if (adviceEl) adviceEl.textContent = preset.advice;

    const breakdown = calculateBreakdown();
    let totalCost = 0;

    if (breakdownEl) {
      breakdownEl.innerHTML = '';
      breakdown.forEach(function (entry) {
        totalCost += entry.subtotal;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start px-0';
        li.innerHTML =
          '<div>' +
            '<span class="fw-bold d-block">' + entry.item.name + '</span>' +
            '<small class="text-muted-bakery">' + entry.units + ' ' + entry.item.unitLabel +
            (entry.units > 1 && entry.item.unitLabel === 'box' ? 'es' : entry.units > 1 && entry.item.unitLabel !== 'dozen' ? 's' : '') +
            ' &times; ' + formatPKR(entry.item.pricePerUnit) + '</small>' +
          '</div>' +
          '<span class="fw-bold">' + formatPKR(entry.subtotal) + '</span>';
        breakdownEl.appendChild(li);
      });
    }

    const perGuest = totalCost / formState.guests;
    if (totalEl) totalEl.textContent = formatPKR(totalCost);
    if (perGuestEl) perGuestEl.textContent = formatPKR(perGuest);

    if (budgetRow && budgetStatusText) {
      if (formState.budget !== '') {
        const target = Number(formState.budget);
        const diff = target - totalCost;
        budgetRow.classList.remove('d-none');
        budgetStatusText.className = diff >= 0 ? 'budget-ok' : 'budget-over';
        budgetStatusText.textContent = diff >= 0
          ? 'Within budget (' + formatPKR(diff) + ' left)'
          : 'Over budget by ' + formatPKR(Math.abs(diff));
      } else {
        budgetRow.classList.add('d-none');
      }
    }

    return { breakdown: breakdown, totalCost: totalCost, perGuest: perGuest };
  }

  function saveAndCalculate() {
    writeStorage(STORAGE_KEYS.FORM_STATE, formState);
    return renderEstimate();
  }

  function renderSavedPlans() {
    const listEl = document.getElementById('savedPlansList');
    const emptyEl = document.getElementById('savedPlansEmpty');
    const clearBtn = document.getElementById('clearPlansBtn');
    if (!listEl || !emptyEl || !clearBtn) return;

    const plans = readStorage(STORAGE_KEYS.SAVED_PLANS, []);
    listEl.innerHTML = '';

    if (!Array.isArray(plans) || plans.length === 0) {
      emptyEl.classList.remove('d-none');
      clearBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('d-none');
    clearBtn.disabled = false;

    plans.forEach(function (plan, index) {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      const card = document.createElement('div');
      card.className = 'saved-plan-card p-3 h-100 d-flex flex-column justify-content-between';
      card.innerHTML =
        '<div>' +
          '<h3 class="h6 mb-1">' + plan.name + '</h3>' +
          '<p class="small text-muted-bakery mb-2">' + plan.guests + ' guests &bull; ' + plan.occasionLabel + ' &bull; <strong>' + formatPKR(plan.totalCost) + '</strong></p>' +
        '</div>' +
        '<div class="d-flex gap-2">' +
          '<button type="button" class="btn btn-bakery btn-sm flex-grow-1 load-plan-btn">Load Plan</button>' +
          '<button type="button" class="btn btn-outline-bakery btn-sm delete-plan-btn">Delete</button>' +
        '</div>';

      card.querySelector('.load-plan-btn').addEventListener('click', function () {
        formState = {
          guests: plan.guests,
          occasion: plan.occasion,
          style: plan.style,
          budget: plan.budget || '',
          selectedIds: plan.selectedIds.slice()
        };
        syncDomWithState();
        saveAndCalculate();
        showBanner('Loaded party plan "' + plan.name + '".');
      });

      card.querySelector('.delete-plan-btn').addEventListener('click', function () {
        const updated = readStorage(STORAGE_KEYS.SAVED_PLANS, []);
        updated.splice(index, 1);
        writeStorage(STORAGE_KEYS.SAVED_PLANS, updated);
        renderSavedPlans();
        showBanner('Deleted saved plan "' + plan.name + '".');
      });

      col.appendChild(card);
      listEl.appendChild(col);
    });
  }

  function syncDomWithState() {
    const guestInput = document.getElementById('guestCount');
    const occasionSelect = document.getElementById('occasionSelect');
    const styleSelect = document.getElementById('servingStyle');
    const budgetInput = document.getElementById('budgetTarget');

    if (guestInput) guestInput.value = formState.guests;
    if (occasionSelect) occasionSelect.value = formState.occasion;
    if (styleSelect) styleSelect.value = formState.style;
    if (budgetInput) budgetInput.value = formState.budget;

    renderItemCheckboxes();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const saved = readStorage(STORAGE_KEYS.FORM_STATE, null);
    if (saved && typeof saved === 'object') {
      formState.guests = Number(saved.guests) >= 5 ? Number(saved.guests) : 20;
      formState.occasion = saved.occasion || 'birthday';
      formState.style = saved.style || 'standard';
      formState.budget = saved.budget || '';
      if (Array.isArray(saved.selectedIds)) {
        formState.selectedIds = saved.selectedIds;
      }
    }

    renderOccasionOptions();
    syncDomWithState();
    updateNavCartBadge();
    renderEstimate();
    renderSavedPlans();

    const guestInput = document.getElementById('guestCount');
    const occasionSelect = document.getElementById('occasionSelect');
    const styleSelect = document.getElementById('servingStyle');
    const budgetInput = document.getElementById('budgetTarget');
    const calcForm = document.getElementById('partyCalcForm');
    const selectRecommendedBtn = document.getElementById('selectRecommendedBtn');
    const clearItemsBtn = document.getElementById('clearItemsBtn');
    const resetCalcBtn = document.getElementById('resetCalcBtn');
    const addEstimateBtn = document.getElementById('addEstimateToCartBtn');
    const savePlanForm = document.getElementById('savePlanForm');
    const clearPlansBtn = document.getElementById('clearPlansBtn');

    if (guestInput) guestInput.addEventListener('input', saveAndCalculate);
    if (budgetInput) budgetInput.addEventListener('input', saveAndCalculate);

    if (occasionSelect) {
      occasionSelect.addEventListener('change', function (e) {
        formState.occasion = e.target.value;
        saveAndCalculate();
      });
    }

    if (styleSelect) {
      styleSelect.addEventListener('change', function (e) {
        formState.style = e.target.value;
        saveAndCalculate();
      });
    }

    if (calcForm) {
      calcForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveAndCalculate();
      });
    }

    if (selectRecommendedBtn) {
      selectRecommendedBtn.addEventListener('click', function () {
        const preset = OCCASION_PRESETS.find(function (p) { return p.id === formState.occasion; });
        if (preset) {
          formState.selectedIds = preset.recommendedItems.slice();
          renderItemCheckboxes();
          saveAndCalculate();
          showBanner('Applied recommended treats for ' + preset.label + '.');
        }
      });
    }

    if (clearItemsBtn) {
      clearItemsBtn.addEventListener('click', function () {
        formState.selectedIds = [];
        renderItemCheckboxes();
        saveAndCalculate();
      });
    }

    if (resetCalcBtn) {
      resetCalcBtn.addEventListener('click', function () {
        formState = {
          guests: 20,
          occasion: 'birthday',
          style: 'standard',
          budget: '',
          selectedIds: ['cake-fudge', 'cupcakes-redvelvet', 'brownies-caramel']
        };
        syncDomWithState();
        saveAndCalculate();
        showBanner('Calculator reset to default values.');
      });
    }

    if (addEstimateBtn) {
      addEstimateBtn.addEventListener('click', function () {
        const result = saveAndCalculate();
        if (!result) return;

        const cart = readStorage(STORAGE_KEYS.CART, []);
        const safeCart = Array.isArray(cart) ? cart : [];

        result.breakdown.forEach(function (entry) {
          const existing = safeCart.find(function (c) { return c.id === entry.item.id; });
          if (existing) {
            existing.quantity = (Number(existing.quantity) || 1) + entry.units;
          } else {
            safeCart.push({
              id: entry.item.id,
              name: entry.item.name,
              price: entry.item.pricePerUnit,
              quantity: entry.units,
              type: 'party-estimate'
            });
          }
        });

        writeStorage(STORAGE_KEYS.CART, safeCart);
        updateNavCartBadge();
        showBanner('Added ' + result.breakdown.length + ' party items (' + formatPKR(result.totalCost) + ') to your basket.');
      });
    }

    if (savePlanForm) {
      savePlanForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('planNameInput');
        const nameError = document.getElementById('planNameError');
        const result = saveAndCalculate();
        if (!result || !nameInput) return;

        const planName = nameInput.value.trim();
        if (planName.length < 2) {
          if (nameError) {
            nameError.textContent = 'Please enter a short name for this party plan.';
            nameError.classList.remove('d-none');
          }
          nameInput.classList.add('is-invalid');
          return;
        }

        if (nameError) nameError.classList.add('d-none');
        nameInput.classList.remove('is-invalid');

        const preset = OCCASION_PRESETS.find(function (p) { return p.id === formState.occasion; }) || OCCASION_PRESETS[0];
        const plans = readStorage(STORAGE_KEYS.SAVED_PLANS, []);
        const safePlans = Array.isArray(plans) ? plans : [];

        safePlans.unshift({
          name: planName,
          guests: formState.guests,
          occasion: formState.occasion,
          occasionLabel: preset.label,
          style: formState.style,
          budget: formState.budget,
          selectedIds: formState.selectedIds.slice(),
          totalCost: result.totalCost
        });

        writeStorage(STORAGE_KEYS.SAVED_PLANS, safePlans);
        nameInput.value = '';
        renderSavedPlans();
        showBanner('Saved party plan "' + planName + '".');
      });
    }

    if (clearPlansBtn) {
      clearPlansBtn.addEventListener('click', function () {
        writeStorage(STORAGE_KEYS.SAVED_PLANS, []);
        renderSavedPlans();
        showBanner('Cleared all saved party plans.');
      });
    }
  });
})();
