/**
 * The Sweet Oven - FAQ Page
 * Data-driven FAQ accordion, search/category filtering, and localStorage state.
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    FAQ_STATE: 'sweetOvenFaqState',
    SUBMITTED_QUESTIONS: 'sweetOvenFaqQuestions',
    CART: 'sweetOvenCart'
  };

  const FAQ_CATEGORIES = [
    'All',
    'Ordering & Lead Time',
    'Custom Cakes',
    'Delivery & Pickup',
    'Ingredients & Allergens',
    'Payments & Cancellations'
  ];

  const FAQ_ITEMS = [
    {
      id: 'faq-lead-time',
      category: 'Ordering & Lead Time',
      question: 'How far in advance should I place an order?',
      answer: 'For weekly menu boxes (brownies, croissants, cinnamon rolls, and cupcakes), please order at least 24 hours in advance. Custom celebration cakes and large party platters require 48 to 72 hours notice so we can bake and chill everything fresh.'
    },
    {
      id: 'faq-same-day',
      category: 'Ordering & Lead Time',
      question: 'Do you offer same-day orders?',
      answer: 'We bake in small home batches every morning. A limited selection of brownie boxes and tea-time treats is sometimes available for same-day pickup after 2:00 PM—call us on +92 300 1234567 to check daily oven availability.'
    },
    {
      id: 'faq-custom-flavours',
      category: 'Custom Cakes',
      question: 'What custom cake flavours and weights do you offer?',
      answer: 'Our most popular flavours are Belgian Chocolate Fudge, Lotus Biscoff, Red Velvet Cream Cheese, Classic Vanilla Bean Strawberry, and Salted Caramel Espresso. Custom cakes start at 2 lb (PKR 3,300) and go up to tiered party cakes.'
    },
    {
      id: 'faq-custom-design',
      category: 'Custom Cakes',
      question: 'Can I request a custom colour theme or message on my cake?',
      answer: 'Yes! You can specify buttercream colours, floral piping, or a custom cake topper message in the Custom Cake Request page or checkout notes. We prefer whipped buttercream and ganache over heavy fondant for better taste.'
    },
    {
      id: 'faq-delivery-areas',
      category: 'Delivery & Pickup',
      question: 'Which areas do you deliver to and what are the delivery charges?',
      answer: 'We deliver across Islamabad (F-sectors, G-sectors, E-sectors, DHA, Bahria Town) for PKR 250–450 depending on distance, and selected Rawalpindi sectors for PKR 400–550. Self-pickup from our F-10 kitchen is always free.'
    },
    {
      id: 'faq-storage',
      category: 'Delivery & Pickup',
      question: 'How should I store my cake or tres leches before serving?',
      answer: 'Keep cream-frosted cakes and Lotus Tres Leches refrigerated until 20–30 minutes before cutting. Fudge brownies and cookies stay fresh in an airtight container at room temperature for up to 3 days.'
    },
    {
      id: 'faq-eggless',
      category: 'Ingredients & Allergens',
      question: 'Do you offer eggless or nut-free options?',
      answer: 'Yes, we bake eggless chocolate fudge cakes, vanilla cupcakes, and Lotus Tres Leches on request (no extra charge). Please note our kitchen handles almonds, walnuts, pistachios, dairy, and gluten, so trace cross-contact is possible.'
    },
    {
      id: 'faq-halal',
      category: 'Ingredients & Allergens',
      question: 'Are all ingredients halal and preservative-free?',
      answer: '100% of our ingredients are halal-certified, including real dairy butter, Belgian cocoa, and halal gelatin-free glazes. We never use artificial preservatives or commercial cake mixes.'
    },
    {
      id: 'faq-payment-methods',
      category: 'Payments & Cancellations',
      question: 'What payment methods do you accept?',
      answer: 'We accept Cash on Delivery (for standard orders under PKR 5,000), Bank Transfer (IBFT), SadaPay, Nayapay, and Easypaisa/JazzCash. Custom cakes and party orders require a 50% advance deposit to confirm your baking slot.'
    },
    {
      id: 'faq-cancellation',
      category: 'Payments & Cancellations',
      question: 'What is your cancellation or rescheduling policy?',
      answer: 'Orders can be rescheduled free of charge up to 24 hours before the scheduled delivery window. Cancellations made at least 24 hours ahead receive a full refund or store credit; same-day cancellations are non-refundable once baking has started.'
    }
  ];

  let state = {
    category: 'All',
    search: '',
    openIds: ['faq-lead-time']
  };

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

  function saveState() {
    writeStorage(STORAGE_KEYS.FAQ_STATE, state);
  }

  function renderCategories() {
    const container = document.getElementById('faqCategoryFilters');
    if (!container) return;
    container.innerHTML = '';

    FAQ_CATEGORIES.forEach(function (category) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'faq-pill' + (state.category === category ? ' is-active' : '');
      btn.textContent = category;
      btn.setAttribute('aria-pressed', String(state.category === category));
      btn.addEventListener('click', function () {
        state.category = category;
        saveState();
        renderCategories();
        renderFaqList();
      });
      container.appendChild(btn);
    });
  }

  function getFilteredFaqs() {
    const query = state.search.trim().toLowerCase();
    return FAQ_ITEMS.filter(function (item) {
      const matchesCat = state.category === 'All' || item.category === state.category;
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        item.question.toLowerCase().indexOf(query) !== -1 ||
        item.answer.toLowerCase().indexOf(query) !== -1 ||
        item.category.toLowerCase().indexOf(query) !== -1
      );
    });
  }

  function renderFaqList() {
    const listEl = document.getElementById('faqAccordionList');
    const emptyEl = document.getElementById('faqEmptyState');
    const countEl = document.getElementById('faqResultCount');
    if (!listEl || !emptyEl || !countEl) return;

    const faqs = getFilteredFaqs();
    listEl.innerHTML = '';
    countEl.textContent = 'Showing ' + faqs.length + ' of ' + FAQ_ITEMS.length + ' questions';

    if (faqs.length === 0) {
      emptyEl.classList.remove('d-none');
      return;
    }

    emptyEl.classList.add('d-none');

    faqs.forEach(function (item) {
      const isOpen = state.openIds.indexOf(item.id) !== -1;
      const panelId = 'panel-' + item.id;

      const article = document.createElement('article');
      article.className = 'card faq-item';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'faq-trigger';
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-controls', panelId);
      button.innerHTML =
        '<span>' +
          '<span class="badge badge-pink rounded-pill me-2">' + item.category + '</span>' +
          '<span>' + item.question + '</span>' +
        '</span>' +
        '<span class="faq-icon" aria-hidden="true">' + (isOpen ? '−' : '+') + '</span>';

      const panel = document.createElement('div');
      panel.id = panelId;
      panel.className = 'faq-panel' + (isOpen ? '' : ' d-none');
      panel.innerHTML = '<p class="mb-0">' + item.answer + '</p>';

      button.addEventListener('click', function () {
        const currentlyOpen = state.openIds.indexOf(item.id) !== -1;
        if (currentlyOpen) {
          state.openIds = state.openIds.filter(function (id) { return id !== item.id; });
        } else {
          state.openIds.push(item.id);
        }
        saveState();
        renderFaqList();
      });

      article.appendChild(button);
      article.appendChild(panel);
      listEl.appendChild(article);
    });
  }

  function renderSubmittedQuestions() {
    const listEl = document.getElementById('submittedQuestionsList');
    const emptyEl = document.getElementById('submittedQuestionsEmpty');
    const clearBtn = document.getElementById('clearSubmittedQuestionsBtn');
    if (!listEl || !emptyEl || !clearBtn) return;

    const questions = readStorage(STORAGE_KEYS.SUBMITTED_QUESTIONS, []);
    listEl.innerHTML = '';

    if (!Array.isArray(questions) || questions.length === 0) {
      emptyEl.classList.remove('d-none');
      clearBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('d-none');
    clearBtn.disabled = false;

    questions.forEach(function (entry) {
      const box = document.createElement('div');
      box.className = 'submitted-q-card p-3';
      box.innerHTML =
        '<div class="d-flex justify-content-between align-items-center mb-1">' +
          '<strong class="small">' + entry.name + '</strong>' +
          '<small class="text-muted-bakery">' + entry.date + '</small>' +
        '</div>' +
        '<p class="mb-1">' + entry.question + '</p>' +
        '<small class="text-muted-bakery">Reply will be sent to: ' + entry.email + '</small>';
      listEl.appendChild(box);
    });
  }

  function clearFilters() {
    state.category = 'All';
    state.search = '';
    const searchInput = document.getElementById('faqSearchInput');
    if (searchInput) searchInput.value = '';
    saveState();
    renderCategories();
    renderFaqList();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const savedState = readStorage(STORAGE_KEYS.FAQ_STATE, null);
    if (savedState && typeof savedState === 'object') {
      state.category = FAQ_CATEGORIES.indexOf(savedState.category) !== -1 ? savedState.category : 'All';
      state.search = typeof savedState.search === 'string' ? savedState.search : '';
      if (Array.isArray(savedState.openIds)) {
        state.openIds = savedState.openIds;
      }
    }

    const searchInput = document.getElementById('faqSearchInput');
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    const clearFaqFiltersBtn = document.getElementById('clearFaqFiltersBtn');
    const askForm = document.getElementById('askQuestionForm');
    const clearQuestionsBtn = document.getElementById('clearSubmittedQuestionsBtn');

    if (searchInput) {
      searchInput.value = state.search;
      searchInput.addEventListener('input', function (e) {
        state.search = e.target.value;
        saveState();
        renderFaqList();
      });
    }

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', function () {
        state.openIds = getFilteredFaqs().map(function (item) { return item.id; });
        saveState();
        renderFaqList();
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', function () {
        state.openIds = [];
        saveState();
        renderFaqList();
      });
    }

    if (clearFaqFiltersBtn) {
      clearFaqFiltersBtn.addEventListener('click', clearFilters);
    }

    if (askForm) {
      askForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('askerName');
        const emailInput = document.getElementById('askerEmail');
        const questionInput = document.getElementById('askerQuestion');
        const nameErr = document.getElementById('askerNameError');
        const emailErr = document.getElementById('askerEmailError');
        const questionErr = document.getElementById('askerQuestionError');
        const feedback = document.getElementById('askFormFeedback');

        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const questionVal = questionInput.value.trim();

        let valid = true;

        if (nameVal.length < 2) {
          nameErr.textContent = 'Please enter your name (at least 2 characters).';
          nameErr.classList.remove('d-none');
          nameInput.classList.add('is-invalid');
          valid = false;
        } else {
          nameErr.classList.add('d-none');
          nameInput.classList.remove('is-invalid');
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
          emailErr.textContent = 'Please enter a valid email address.';
          emailErr.classList.remove('d-none');
          emailInput.classList.add('is-invalid');
          valid = false;
        } else {
          emailErr.classList.add('d-none');
          emailInput.classList.remove('is-invalid');
        }

        if (questionVal.length < 8) {
          questionErr.textContent = 'Please enter a question (at least 8 characters).';
          questionErr.classList.remove('d-none');
          questionInput.classList.add('is-invalid');
          valid = false;
        } else {
          questionErr.classList.add('d-none');
          questionInput.classList.remove('is-invalid');
        }

        if (!valid) return;

        const existing = readStorage(STORAGE_KEYS.SUBMITTED_QUESTIONS, []);
        const safeList = Array.isArray(existing) ? existing : [];
        safeList.unshift({
          name: nameVal,
          email: emailVal,
          question: questionVal,
          date: new Date().toLocaleDateString('en-PK')
        });

        writeStorage(STORAGE_KEYS.SUBMITTED_QUESTIONS, safeList);
        askForm.reset();
        renderSubmittedQuestions();

        if (feedback) {
          feedback.textContent = 'Thank you, ' + nameVal + '! Your question has been saved for our baker.';
          feedback.classList.remove('d-none');
        }
      });
    }

    if (clearQuestionsBtn) {
      clearQuestionsBtn.addEventListener('click', function () {
        writeStorage(STORAGE_KEYS.SUBMITTED_QUESTIONS, []);
        renderSubmittedQuestions();
      });
    }

    updateNavCartBadge();
    renderCategories();
    renderFaqList();
    renderSubmittedQuestions();
  });
})();
