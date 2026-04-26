import { API_BASE_URL, state } from './state.js';
import { fetchWithAuth } from './http.js';

export async function apiFetchBoxes() {
    const response = await fetchWithAuth(`${API_BASE_URL}/boxes`);
    if (!response.ok) throw new Error('Failed to fetch boxes');
    return response.json();
}

export async function apiFetchSubjects() {
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
}

export async function apiFetchTags() {
    const url = state.activeSubjectId
        ? `${API_BASE_URL}/tags?subjectId=${state.activeSubjectId}`
        : `${API_BASE_URL}/tags`;
    const response = await fetchWithAuth(url);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
}

export async function apiFetchCards() {
    const tagFilterQuery = Array.from(state.activeTagFilters).join(',');
    const params = new URLSearchParams();
    if (tagFilterQuery) params.append('tags', tagFilterQuery);
    if (state.activeSubjectId) params.append('subjectId', state.activeSubjectId);
    const response = await fetchWithAuth(`${API_BASE_URL}/cards?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch cards');
    return response.json();
}

export async function apiCreateCard(cardData) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cards`, {
        method: 'POST',
        body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to create card');
    return response.json();
}

export async function apiUpdateCard(cardId, cardData) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cards/${cardId}`, {
        method: 'PATCH',
        body: JSON.stringify(cardData),
    });
    if (!response.ok) throw new Error('Failed to update card');
    return response.json();
}

export async function apiDeleteCard(cardId) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cards/${cardId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete card');
    return response.json();
}

export async function apiCreateTag(tagData) {
    const response = await fetchWithAuth(`${API_BASE_URL}/tags`, {
        method: 'POST',
        body: JSON.stringify(tagData),
    });
    if (!response.ok) throw new Error('Failed to create tag');
    return response.json();
}

export async function apiDeleteTag(tagId) {
    const response = await fetchWithAuth(`${API_BASE_URL}/tags/${tagId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tag');
    return response.json();
}

export async function apiCreateSubject(subjectData) {
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        body: JSON.stringify(subjectData),
    });
    if (!response.ok) throw new Error('Failed to create subject');
    return response.json();
}

export async function apiDeleteSubject(subjectId) {
    const response = await fetchWithAuth(`${API_BASE_URL}/subjects/${subjectId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const err = await response.json();
        alert(err.message);
        throw new Error('Failed to delete subject');
    }
    return response.json();
}

export async function apiHandleCardReview(cardId, isCorrect, timeSpent = 0) {
    const response = await fetchWithAuth(`${API_BASE_URL}/cards/review`, {
        method: 'POST',
        body: JSON.stringify({ cardId, isCorrect, timeSpent }),
    });
    if (!response.ok) throw new Error('Failed to review card');
    return response.json();
}

export async function apiFetchCardLogs(cardId) {
    const response = await fetchWithAuth(`${API_BASE_URL}/card-logs/${cardId}`);
    if (!response.ok) throw new Error('Failed to fetch card logs');
    return response.json();
}
