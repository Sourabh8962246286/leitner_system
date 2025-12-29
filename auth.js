const API_URL = 'https://leitner-system-2hz1.onrender.com';
const TOKEN_KEY = 'leitner_access_token';

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  console.log('Page loaded:', path);

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
  } else if (!path.includes('login.html') && !path.includes('register.html')) {
    // Protect all other pages
    const token = getToken();
    console.log('Token on page load:', token);
    if (!token) {
      console.log('No token found, redirecting to login.');
      window.location.href = '/login.html';
    }
  }
});

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

    console.log('Login successful, token received:', data.access_token);
    setToken(data.access_token);
    console.log('Redirecting to index.html...');
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
    console.log('Registration successful, redirecting to login.html');
    window.location.href = '/login.html';

  } catch (error) {
    errorMessageDiv.textContent = error.message;
    errorMessageDiv.style.display = 'block';
  }
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  console.log('Token stored in localStorage.');
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
