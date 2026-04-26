import { state } from './state.js';
import { apiFetchTags, apiCreateTag, apiDeleteTag } from './api.js';

let _tagsList, _tagFilters, _cardTagsContainer;
let _refreshUI;

export function init(domRefs, callbacks) {
    ({ tagsList: _tagsList, tagFilters: _tagFilters, cardTagsContainer: _cardTagsContainer } = domRefs);
    ({ refreshUI: _refreshUI } = callbacks);
}

export function renderTagList() {
    _tagsList.innerHTML = '';
    state.tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<span>${tag.name}</span><button class="btn-close delete-tag-btn" data-tag-id="${tag._id}"></button>`;
        _tagsList.appendChild(li);
    });
    _tagsList.querySelectorAll('.delete-tag-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTag);
    });
}

export function renderTagFilters() {
    _tagFilters.innerHTML = '';
    state.tags.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `<input class="form-check-input" type="checkbox" value="${tag._id}" id="tag-filter-${tag._id}">
                         <label class="form-check-label" for="tag-filter-${tag._id}">${tag.name}</label>`;
        _tagFilters.appendChild(div);
    });
    _tagFilters.querySelectorAll('input').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

export function renderAllTagElements() {
    renderTagList();
    renderTagFilters();
    renderTagCheckboxes(_cardTagsContainer, state.tags);
}

export function renderTagCheckboxes(container, tagsToRender = [], checkedTags = []) {
    container.innerHTML = '<h6>Tags</h6>';
    if (!tagsToRender.length) return;
    tagsToRender.forEach(tag => {
        const isChecked = checkedTags.includes(tag._id);
        const div = document.createElement('div');
        div.className = 'form-check form-check-inline';
        div.innerHTML = `<input class="form-check-input" type="checkbox" name="tags" value="${tag._id}" id="edit-tag-${tag._id}" ${isChecked ? 'checked' : ''}>
                         <label class="form-check-label" for="edit-tag-${tag._id}">${tag.name}</label>`;
        container.appendChild(div);
    });
}

export async function handleCreateTag(e) {
    e.preventDefault();
    if (!state.activeSubjectId) {
        alert('Please select a subject first before creating a tag.');
        return;
    }
    const tagNameInput = document.getElementById('tag-name');
    const name = tagNameInput.value;
    if (!name) return;
    await apiCreateTag({ name, subjectId: state.activeSubjectId });
    tagNameInput.value = '';
    state.tags = await apiFetchTags();
    renderAllTagElements();
}

export async function handleDeleteTag(e) {
    const tagId = e.target.dataset.tagId;
    if (confirm('Are you sure you want to delete this tag?')) {
        await apiDeleteTag(tagId);
        await _refreshUI();
    }
}

export async function handleFilterChange(e) {
    const tagId = e.target.value;
    if (e.target.checked) {
        state.activeTagFilters.add(tagId);
    } else {
        state.activeTagFilters.delete(tagId);
    }
    await _refreshUI();
}
