export async function fetchWithAuth(url, options = {}) {
    const token = window.auth.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        console.error('Authentication error: Token might be expired.');
        window.auth.logout();
        return;
    }
    return response;
}
