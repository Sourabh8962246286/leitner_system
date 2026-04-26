const API_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = 'leitner_access_token';

function initAuth() {
  const path = window.location.pathname;

  // Initialize dark mode
  initDarkMode();

  if (path.includes('login.html')) {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  } else if (path.includes('register.html')) {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
  } else {
    const token = getToken();
    if (!token) {
      window.location.href = '/login.html';
    }
  }
}

function initDarkMode() {
  // Apply dark mode if it was previously enabled
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Setup dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle-auth');
  if (darkModeToggle) {
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    darkModeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
      darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;
  const errorMessageDiv = document.getElementById('error-message');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setToken(data.access_token);
    window.location.href = '/index.html';
  } catch (error) {
    errorMessageDiv.textContent = error.message;
    errorMessageDiv.style.display = 'block';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value;
  const email = form.email.value;
  const phoneNumber = form.phoneNumber.value;
  const password = form.password.value;
  const errorMessageDiv = document.getElementById('error-message');

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phoneNumber, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Registration failed');
      throw new Error(message);
    }

    // On successful registration, redirect to the login page.
    window.location.href = '/login.html';

  } catch (error) {
    errorMessageDiv.textContent = error.message;
    errorMessageDiv.style.display = 'block';
  }
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = '/login.html';
}

// Function to be used by other frontend scripts
window.auth = {
  getToken,
  logout,
};
