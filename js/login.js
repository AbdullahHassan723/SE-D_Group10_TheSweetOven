/* ==========================================================================
   The Sweet Oven - Login, Sign Up & Forgot Password Script (pages/login.html)
   Pure vanilla JavaScript using localStorage for users and active session.
   Depends on js/auth.js (window.SweetOvenAuth).
   ========================================================================== */

(function () {
  "use strict";

  var USERS_STORAGE_KEY = "sweetOvenUsers";

  function safeParseJSON(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPakistaniPhone(phone) {
    var compact = String(phone || "").replace(/[\s-]/g, "");
    return /^(03\d{9}|\+?923\d{9})$/.test(compact);
  }

  function isValidPassword(password) {
    return (
      typeof password === "string" &&
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  }

  function loadUsers() {
    if (window.SweetOvenAuth && typeof window.SweetOvenAuth.cleanupLegacyData === "function") {
      window.SweetOvenAuth.cleanupLegacyData();
    }
    try {
      var parsed = safeParseJSON(localStorage.getItem(USERS_STORAGE_KEY), []);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (err) {
      // Ignore storage write errors when storage is disabled
    }
  }

  function findUserByEmail(users, email) {
    var target = normalizeEmail(email);
    for (var i = 0; i < users.length; i += 1) {
      if (users[i] && normalizeEmail(users[i].email) === target) {
        return users[i];
      }
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var authHelper = window.SweetOvenAuth;

    var authView = document.getElementById("authView");
    var accountView = document.getElementById("accountView");
    var authHeading = document.getElementById("authHeading");
    var authSubtitle = document.getElementById("authSubtitle");

    var authTabsContainer = document.getElementById("authTabs");
    var loginTabBtn = document.getElementById("loginTabBtn");
    var signupTabBtn = document.getElementById("signupTabBtn");
    var loginPanel = document.getElementById("loginPanel");
    var signupPanel = document.getElementById("signupPanel");
    var forgotPanel = document.getElementById("forgotPanel");

    var authFeedback = document.getElementById("authFeedback");

    var loginForm = document.getElementById("loginForm");
    var loginEmail = document.getElementById("loginEmail");
    var loginPassword = document.getElementById("loginPassword");
    var loginEmailError = document.getElementById("loginEmailError");
    var loginPasswordError = document.getElementById("loginPasswordError");
    var loginSubmitBtn = document.getElementById("loginSubmitBtn");

    var forgotPasswordLink = document.getElementById("forgotPasswordLink");
    var forgotForm = document.getElementById("forgotForm");
    var forgotEmail = document.getElementById("forgotEmail");
    var forgotEmailError = document.getElementById("forgotEmailError");
    var forgotFeedback = document.getElementById("forgotFeedback");
    var resetPasswordForm = document.getElementById("resetPasswordForm");
    var resetNewPassword = document.getElementById("resetNewPassword");
    var resetConfirmPassword = document.getElementById("resetConfirmPassword");
    var resetNewPasswordError = document.getElementById("resetNewPasswordError");
    var resetConfirmPasswordError = document.getElementById("resetConfirmPasswordError");
    var backToLoginLink = document.getElementById("backToLoginLink");
    var pendingResetEmail = "";

    var signupForm = document.getElementById("signupForm");
    var signupName = document.getElementById("signupName");
    var signupEmail = document.getElementById("signupEmail");
    var signupPhone = document.getElementById("signupPhone");
    var signupPassword = document.getElementById("signupPassword");
    var signupConfirmPassword = document.getElementById("signupConfirmPassword");

    var signupNameError = document.getElementById("signupNameError");
    var signupEmailError = document.getElementById("signupEmailError");
    var signupPhoneError = document.getElementById("signupPhoneError");
    var signupPasswordError = document.getElementById("signupPasswordError");
    var signupConfirmPasswordError = document.getElementById("signupConfirmPasswordError");
    var signupSubmitBtn = document.getElementById("signupSubmitBtn");

    var welcomeUserHeading = document.getElementById("welcomeUserHeading");
    var loggedInEmail = document.getElementById("loggedInEmail");
    var userPointsText = document.getElementById("userPointsText");
    var logoutBtn = document.getElementById("logoutBtn");

    var passwordToggleButtons = document.querySelectorAll(".password-toggle-btn");
    var loginRedirectTimer = null;

    // Run legacy cleanup on load without seeding any demo user
    loadUsers();

    function showFeedback(message, type) {
      authFeedback.textContent = message;
      authFeedback.className = "auth-feedback mb-3 " + (type === "success" ? "auth-feedback-success" : "auth-feedback-error");
    }

    function clearFeedback() {
      authFeedback.textContent = "";
      authFeedback.className = "auth-feedback d-none mb-3";
    }

    function setFieldError(inputEl, errorEl, message) {
      if (inputEl) {
        inputEl.classList.add("is-invalid-field");
        inputEl.setAttribute("aria-invalid", "true");
      }
      if (errorEl) {
        errorEl.textContent = message || "";
      }
    }

    function clearFieldError(inputEl, errorEl) {
      if (inputEl) {
        inputEl.classList.remove("is-invalid-field");
        inputEl.removeAttribute("aria-invalid");
      }
      if (errorEl) {
        errorEl.textContent = "";
      }
    }

    function clearLoginErrors() {
      clearFieldError(loginEmail, loginEmailError);
      clearFieldError(loginPassword, loginPasswordError);
    }

    function clearSignupErrors() {
      clearFieldError(signupName, signupNameError);
      clearFieldError(signupEmail, signupEmailError);
      clearFieldError(signupPhone, signupPhoneError);
      clearFieldError(signupPassword, signupPasswordError);
      clearFieldError(signupConfirmPassword, signupConfirmPasswordError);
    }

    function clearForgotErrors() {
      clearFieldError(forgotEmail, forgotEmailError);
      clearFieldError(resetNewPassword, resetNewPasswordError);
      clearFieldError(resetConfirmPassword, resetConfirmPasswordError);
    }

    function resetForgotFlowState() {
      pendingResetEmail = "";
      forgotForm.reset();
      resetPasswordForm.reset();
      clearForgotErrors();
      forgotFeedback.classList.add("d-none");
      forgotFeedback.textContent = "";
      forgotForm.classList.remove("d-none");
      resetPasswordForm.classList.add("d-none");
    }

    function resetPasswordToggles() {
      passwordToggleButtons.forEach(function (btn) {
        var targetId = btn.getAttribute("data-target");
        var input = targetId ? document.getElementById(targetId) : null;
        if (input) {
          input.type = "password";
        }
        btn.textContent = "Show";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", btn.getAttribute("data-show-label") || "Show password");
      });
    }

    function switchTab(tabName) {
      if (loginRedirectTimer) {
        clearTimeout(loginRedirectTimer);
        loginRedirectTimer = null;
      }

      clearFeedback();
      clearLoginErrors();
      clearSignupErrors();
      resetForgotFlowState();
      resetPasswordToggles();

      loginSubmitBtn.disabled = false;
      signupSubmitBtn.disabled = false;

      var isLogin = tabName === "login";
      var isSignup = tabName === "signup";
      var isForgot = tabName === "forgot";

      authTabsContainer.classList.toggle("d-none", isForgot);

      loginTabBtn.classList.toggle("is-active", isLogin);
      loginTabBtn.setAttribute("aria-selected", String(isLogin));
      loginTabBtn.setAttribute("tabindex", isLogin ? "0" : "-1");

      signupTabBtn.classList.toggle("is-active", isSignup);
      signupTabBtn.setAttribute("aria-selected", String(isSignup));
      signupTabBtn.setAttribute("tabindex", isSignup ? "0" : "-1");

      loginPanel.classList.toggle("d-none", !isLogin);
      signupPanel.classList.toggle("d-none", !isSignup);
      forgotPanel.classList.toggle("d-none", !isForgot);

      if (isForgot) {
        authHeading.textContent = "Reset password";
        authSubtitle.textContent = "Enter your email address and we will send reset instructions.";
      } else if (isSignup) {
        authHeading.textContent = "Create an account";
        authSubtitle.textContent = "Sign up to earn Sweet Oven points and track your orders.";
      } else {
        authHeading.textContent = "Welcome back";
        authSubtitle.textContent = "Sign in to view your Sweet Oven points and orders.";
      }
    }

    function showAccountView(user) {
      var pointsValue = Number.isFinite(Number(user.points)) && Number(user.points) >= 0 ? Number(user.points) : 0;
      welcomeUserHeading.textContent = "Hi, " + user.fullName;
      loggedInEmail.textContent = user.email;
      userPointsText.textContent = "Points: " + pointsValue;

      authView.classList.add("d-none");
      accountView.classList.remove("d-none");
    }

    function showAuthView() {
      accountView.classList.add("d-none");
      authView.classList.remove("d-none");
      resetPasswordToggles();
      loginForm.reset();
      signupForm.reset();
      forgotForm.reset();
      switchTab("login");
    }

    // Live Sign Up field validators
    function validateSignupName() {
      var val = signupName.value.trim();
      if (!val) {
        setFieldError(signupName, signupNameError, "Full name is required.");
        return false;
      }
      if (val.length < 2) {
        setFieldError(signupName, signupNameError, "Full name must be at least 2 characters.");
        return false;
      }
      clearFieldError(signupName, signupNameError);
      return true;
    }

    function validateSignupEmail() {
      var val = normalizeEmail(signupEmail.value);
      if (!val || !isValidEmail(val)) {
        setFieldError(signupEmail, signupEmailError, "Please enter a valid email address.");
        return false;
      }
      var users = loadUsers();
      if (findUserByEmail(users, val)) {
        setFieldError(signupEmail, signupEmailError, "This email is already registered");
        return false;
      }
      clearFieldError(signupEmail, signupEmailError);
      return true;
    }

    function validateSignupPhone() {
      var val = signupPhone.value.trim();
      if (!val || !isValidPakistaniPhone(val)) {
        setFieldError(signupPhone, signupPhoneError, "Enter a valid Pakistani phone (e.g. 03XXXXXXXXX).");
        return false;
      }
      clearFieldError(signupPhone, signupPhoneError);
      return true;
    }

    function validateSignupPassword() {
      var val = signupPassword.value;
      if (!isValidPassword(val)) {
        setFieldError(
          signupPassword,
          signupPasswordError,
          "Password must be at least 8 characters with at least one letter and one number."
        );
        return false;
      }
      clearFieldError(signupPassword, signupPasswordError);
      return true;
    }

    function validateSignupConfirmPassword() {
      var val = signupConfirmPassword.value;
      if (!val) {
        setFieldError(signupConfirmPassword, signupConfirmPasswordError, "Please confirm your password.");
        return false;
      }
      if (val !== signupPassword.value) {
        setFieldError(signupConfirmPassword, signupConfirmPasswordError, "Passwords do not match.");
        return false;
      }
      clearFieldError(signupConfirmPassword, signupConfirmPasswordError);
      return true;
    }

    function validateResetNewPassword() {
      var val = resetNewPassword.value;
      if (!isValidPassword(val)) {
        setFieldError(
          resetNewPassword,
          resetNewPasswordError,
          "Password must be at least 8 characters with at least one letter and one number."
        );
        return false;
      }
      clearFieldError(resetNewPassword, resetNewPasswordError);
      return true;
    }

    function validateResetConfirmPassword() {
      var val = resetConfirmPassword.value;
      if (!val) {
        setFieldError(resetConfirmPassword, resetConfirmPasswordError, "Please confirm your new password.");
        return false;
      }
      if (val !== resetNewPassword.value) {
        setFieldError(resetConfirmPassword, resetConfirmPasswordError, "Passwords do not match.");
        return false;
      }
      clearFieldError(resetConfirmPassword, resetConfirmPasswordError);
      return true;
    }

    // Restore logged-in session on page reload
    var existingSession = authHelper ? authHelper.getCurrentUser() : null;
    if (existingSession) {
      var usersList = loadUsers();
      var matchedUser = findUserByEmail(usersList, existingSession.email);
      if (matchedUser) {
        if (authHelper) {
          authHelper.setCurrentUser(matchedUser);
        }
        showAccountView(matchedUser);
      } else {
        showAccountView(existingSession);
      }
    }

    // Show / Hide password buttons
    passwordToggleButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-target");
        var input = targetId ? document.getElementById(targetId) : null;
        if (!input) return;

        var isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        btn.textContent = isHidden ? "Hide" : "Show";
        btn.setAttribute("aria-pressed", String(isHidden));
        btn.setAttribute(
          "aria-label",
          isHidden
            ? (btn.getAttribute("data-hide-label") || "Hide password")
            : (btn.getAttribute("data-show-label") || "Show password")
        );
      });
    });

    // Tab clicks & keyboard Left/Right arrow navigation
    loginTabBtn.addEventListener("click", function () {
      switchTab("login");
    });

    signupTabBtn.addEventListener("click", function () {
      switchTab("signup");
    });

    [loginTabBtn, signupTabBtn].forEach(function (tabBtn) {
      tabBtn.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          var nextTab = tabBtn === loginTabBtn ? "signup" : "login";
          switchTab(nextTab);
          (nextTab === "login" ? loginTabBtn : signupTabBtn).focus();
        }
      });
    });

    // Clear Login errors while typing
    loginEmail.addEventListener("input", function () {
      clearFieldError(loginEmail, loginEmailError);
      clearFeedback();
    });

    loginPassword.addEventListener("input", function () {
      clearFieldError(loginPassword, loginPasswordError);
      clearFeedback();
    });

    // Live Sign Up validation as the user types
    signupName.addEventListener("input", function () {
      clearFeedback();
      validateSignupName();
    });

    signupEmail.addEventListener("input", function () {
      clearFeedback();
      validateSignupEmail();
    });

    signupPhone.addEventListener("input", function () {
      clearFeedback();
      validateSignupPhone();
    });

    signupPassword.addEventListener("input", function () {
      clearFeedback();
      validateSignupPassword();
      if (signupConfirmPassword.value.length > 0) {
        validateSignupConfirmPassword();
      }
    });

    signupConfirmPassword.addEventListener("input", function () {
      clearFeedback();
      validateSignupConfirmPassword();
    });

    // Forgot Password navigation & simulated reset flow
    forgotPasswordLink.addEventListener("click", function (event) {
      event.preventDefault();
      switchTab("forgot");
      if (loginEmail.value.trim()) {
        forgotEmail.value = loginEmail.value.trim();
      }
      forgotEmail.focus();
    });

    backToLoginLink.addEventListener("click", function (event) {
      event.preventDefault();
      switchTab("login");
      loginEmail.focus();
    });

    forgotEmail.addEventListener("input", function () {
      clearFieldError(forgotEmail, forgotEmailError);
      forgotFeedback.classList.add("d-none");
    });

    forgotForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFieldError(forgotEmail, forgotEmailError);
      forgotFeedback.classList.add("d-none");

      var emailVal = normalizeEmail(forgotEmail.value);
      if (!emailVal || !isValidEmail(emailVal)) {
        setFieldError(forgotEmail, forgotEmailError, "Please enter a valid email address.");
        return;
      }

      var users = loadUsers();
      var user = findUserByEmail(users, emailVal);

      if (!user) {
        forgotFeedback.textContent = "If this email exists, a reset link was sent.";
        forgotFeedback.className = "auth-feedback auth-feedback-success mt-3";
        return;
      }

      pendingResetEmail = normalizeEmail(user.email);
      forgotForm.classList.add("d-none");
      resetPasswordForm.reset();
      clearFieldError(resetNewPassword, resetNewPasswordError);
      clearFieldError(resetConfirmPassword, resetConfirmPasswordError);
      resetPasswordToggles();
      resetPasswordForm.classList.remove("d-none");
      authHeading.textContent = "Reset password";
      authSubtitle.textContent = "Choose a new password for your account.";
      resetNewPassword.focus();
    });

    resetNewPassword.addEventListener("input", function () {
      validateResetNewPassword();
      if (resetConfirmPassword.value.length > 0) {
        validateResetConfirmPassword();
      }
    });

    resetConfirmPassword.addEventListener("input", function () {
      validateResetConfirmPassword();
    });

    resetPasswordForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var okNew = validateResetNewPassword();
      var okConfirm = validateResetConfirmPassword();
      if (!okNew || !okConfirm) {
        return;
      }

      var users = loadUsers();
      var user = findUserByEmail(users, pendingResetEmail);
      if (user) {
        user.password = resetNewPassword.value;
        saveUsers(users);
      }

      var resetEmailCopy = pendingResetEmail;
      switchTab("login");
      if (resetEmailCopy) {
        loginEmail.value = resetEmailCopy;
      }
      loginPassword.value = "";
      showFeedback("Password updated. Please log in.", "success");
      loginPassword.focus();
    });

    // Login form submit
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearLoginErrors();
      clearFeedback();

      var emailVal = normalizeEmail(loginEmail.value);
      var passwordVal = loginPassword.value;
      var hasFieldError = false;

      if (!emailVal || !isValidEmail(emailVal)) {
        setFieldError(loginEmail, loginEmailError, "Please enter a valid email address.");
        hasFieldError = true;
      }

      if (!passwordVal) {
        setFieldError(loginPassword, loginPasswordError, "Please enter your password.");
        hasFieldError = true;
      }

      if (hasFieldError) {
        return;
      }

      var users = loadUsers();
      var user = findUserByEmail(users, emailVal);

      if (!user) {
        setFieldError(loginEmail, loginEmailError, "No account found with this email");
        showFeedback("No account found with this email", "error");
        return;
      }

      if (user.password !== passwordVal) {
        setFieldError(loginEmail, loginEmailError, "");
        setFieldError(loginPassword, loginPasswordError, "");
        showFeedback("Wrong password", "error");
        return;
      }

      if (authHelper) {
        authHelper.setCurrentUser(user);
      }

      showFeedback("Login done \u2713 Welcome back!", "success");
      loginSubmitBtn.disabled = true;

      loginRedirectTimer = setTimeout(function () {
        loginRedirectTimer = null;
        loginSubmitBtn.disabled = false;
        clearFeedback();
        showAccountView(user);
      }, 1500);
    });

    // Sign Up form submit
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFeedback();

      var okName = validateSignupName();
      var okEmail = validateSignupEmail();
      var okPhone = validateSignupPhone();
      var okPassword = validateSignupPassword();
      var okConfirm = validateSignupConfirmPassword();

      if (!okName || !okEmail || !okPhone || !okPassword || !okConfirm) {
        return;
      }

      var newUser = {
        fullName: signupName.value.trim(),
        email: normalizeEmail(signupEmail.value),
        phone: signupPhone.value.trim(),
        password: signupPassword.value,
        points: 0
      };

      var users = loadUsers();
      users.push(newUser);
      saveUsers(users);

      if (authHelper) {
        authHelper.setCurrentUser(newUser);
      }

      showFeedback("Login done \u2713 Welcome back!", "success");
      signupSubmitBtn.disabled = true;

      loginRedirectTimer = setTimeout(function () {
        loginRedirectTimer = null;
        signupSubmitBtn.disabled = false;
        clearFeedback();
        showAccountView(newUser);
      }, 1500);
    });

    // Logout button inside account card
    logoutBtn.addEventListener("click", function () {
      if (loginRedirectTimer) {
        clearTimeout(loginRedirectTimer);
        loginRedirectTimer = null;
      }
      if (authHelper) {
        authHelper.logoutUser();
      } else {
        showAuthView();
      }
    });

    // Sync view if header Logout button is clicked
    document.addEventListener("sweetoven:logout", function () {
      if (loginRedirectTimer) {
        clearTimeout(loginRedirectTimer);
        loginRedirectTimer = null;
      }
      showAuthView();
    });
  });
})();
