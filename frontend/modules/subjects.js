import { state, API_BASE_URL } from './state.js';
import { fetchWithAuth } from './http.js';
import { apiFetchSubjects, apiCreateSubject, apiDeleteSubject } from './api.js';
import { renderTagCheckboxes } from './tags.js';

let _subjectsList, _subjectFilter;
let _refreshUI;

export function init(domRefs, callbacks) {
    ({ subjectsList: _subjectsList, subjectFilter: _subjectFilter } = domRefs);
    ({ refreshUI: _refreshUI } = callbacks);
}

export function renderSubjects() {
    _subjectsList.innerHTML = '';
    state.subjects.forEach(subject => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<span>${subject.name}</span><button class="btn btn-sm btn-close delete-subject-btn" data-subject-id="${subject._id}"></button>`;
        _subjectsList.appendChild(li);
    });
    _subjectsList.querySelectorAll('.delete-subject-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteSubject);
    });
    renderSubjectFilter();
}

export function renderSubjectFilter() {
    const selectedValue = _subjectFilter.value;
    _subjectFilter.innerHTML = '<option value="">All Subjects</option>';
    state.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject._id;
        option.textContent = subject.name;
        _subjectFilter.appendChild(option);
    });
    _subjectFilter.value = selectedValue;
}

export function handleSubjectFilterChange() {
    state.activeSubjectId = _subjectFilter.value;
    state.activeTagFilters.clear();
    _refreshUI();
}

export async function handleCreateSubject(e) {
    e.preventDefault();
    const subjectNameInput = document.getElementById('subject-name');
    const name = subjectNameInput.value;
    if (!name) return;
    await apiCreateSubject({ name });
    subjectNameInput.value = '';
    state.subjects = await apiFetchSubjects();
    renderSubjects();
}

export async function handleDeleteSubject(e) {
    const subjectId = e.target.dataset.subjectId;
    if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
        await apiDeleteSubject(subjectId);
        state.subjects = await apiFetchSubjects();
        renderSubjects();
    }
}

export function renderCardSubjectSelector(container, selectedSubjectId = '', tagsContainer = null) {
    container.innerHTML = '<label for="card-subject" class="form-label">Subject</label>';
    const select = document.createElement('select');
    select.id = 'card-subject';
    select.className = 'form-select';
    select.required = true;

    state.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject._id;
        option.textContent = subject.name;
        select.appendChild(option);
    });

    if (selectedSubjectId) {
        select.value = selectedSubjectId;
    } else if (state.activeSubjectId) {
        select.value = state.activeSubjectId;
    }

    select.addEventListener('change', async () => {
        if (!tagsContainer) return;
        const subjectId = select.value;
        if (subjectId) {
            const response = await fetchWithAuth(`${API_BASE_URL}/tags?subjectId=${subjectId}`);
            const subjectTags = await response.json();
            renderTagCheckboxes(tagsContainer, subjectTags);
        } else {
            renderTagCheckboxes(tagsContainer, []);
        }
    });

    select.dispatchEvent(new Event('change'));
    container.appendChild(select);
}
