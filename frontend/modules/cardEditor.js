import { COLORS } from '../constants.js';
import { state, API_BASE_URL } from './state.js';
import { fetchWithAuth } from './http.js';
import { apiCreateCard, apiUpdateCard, apiDeleteCard } from './api.js';
import { renderCardSubjectSelector } from './subjects.js';
import { renderTagCheckboxes } from './tags.js';

let _cardTagsContainer, _createCardColorSelector, _createCardModal, _createCardForm;
let _refreshUI;

export function init(domRefs, callbacks) {
    ({
        cardTagsContainer: _cardTagsContainer,
        createCardColorSelector: _createCardColorSelector,
        createCardModal: _createCardModal,
        createCardForm: _createCardForm,
    } = domRefs);
    ({ refreshUI: _refreshUI } = callbacks);
}

export function renderColorSelector(container, selectedCardColor = '') {
    container.innerHTML = '<h6>Color</h6>';
    const colorTray = document.createElement('div');
    colorTray.className = 'color-selector-tray';

    COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.dataset.color = color.value;
        if (color.value) {
            swatch.style.backgroundColor = color.value;
        } else {
            swatch.textContent = 'None';
        }
        if (color.value === selectedCardColor) {
            swatch.classList.add('selected');
        }
        swatch.addEventListener('click', () => {
            const previouslySelected = container.querySelector('.color-swatch.selected');
            if (previouslySelected) previouslySelected.classList.remove('selected');
            swatch.classList.add('selected');
        });
        colorTray.appendChild(swatch);
    });
    container.appendChild(colorTray);
}

function linkifyText(text) {
    const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<>"']+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function createCardElement(card, { isForReview = false, onCardClick = null } = {}) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.id = card._id;
    cardElement.draggable = true;
    if (card.color) cardElement.style.backgroundColor = card.color;

    const tagNames = (card.tags && Array.isArray(card.tags))
        ? card.tags.map(tagId => `#${state.tags.find(t => t._id === tagId)?.name}`).filter(Boolean).join(' ')
        : '';

    cardElement.innerHTML = `
        <div class="card-body">
            <div class="front">${card.front}</div>
            <div class="back">${linkifyText(card.back)}</div>
            <div class="card-tag-display text-muted small">${tagNames}</div>
            <div class="card-actions text-end mt-2">
                <button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
            </div>
        </div>
    `;

    if (!isForReview && onCardClick) {
        cardElement.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions') || cardElement.classList.contains('editing')) return;
            onCardClick(card);
        });
    }

    cardElement.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure?')) {
            await apiDeleteCard(card._id);
            await _refreshUI();
        }
    });

    cardElement.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEditMode(cardElement, card);
    });

    return cardElement;
}

export async function toggleEditMode(cardElement, card) {
    cardElement.classList.add('editing');
    cardElement.draggable = false;
    const cardBody = cardElement.querySelector('.card-body');
    const front = cardBody.querySelector('.front');
    const back = cardBody.querySelector('.back');
    const actions = cardBody.querySelector('.card-actions');

    const originalFront = front.textContent;
    const originalBack = back.textContent;

    front.innerHTML = `<textarea class="form-control mb-2 edit-front">${originalFront}</textarea>`;
    back.innerHTML = `<textarea class="form-control edit-back">${originalBack}</textarea>`;

    const editSubjectContainer = document.createElement('div');
    editSubjectContainer.className = 'card-subject-edit my-3';
    renderCardSubjectSelector(editSubjectContainer, card.subjectId);

    const editTagsContainer = document.createElement('div');
    editTagsContainer.className = 'card-tags-edit mb-3';

    const response = await fetchWithAuth(`${API_BASE_URL}/tags?subjectId=${card.subjectId}`);
    const cardSubjectTags = await response.json();
    renderTagCheckboxes(editTagsContainer, cardSubjectTags, card.tags);

    const editColorContainer = document.createElement('div');
    editColorContainer.className = 'card-color-edit mb-3';
    renderColorSelector(editColorContainer, card.color);

    back.appendChild(editSubjectContainer);
    back.appendChild(editTagsContainer);
    back.appendChild(editColorContainer);
    back.style.display = 'block';

    actions.innerHTML = `
        <button class="btn btn-sm btn-success save-btn">Save</button>
        <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
    `;

    actions.querySelector('.save-btn').addEventListener('click', async () => {
        const newFront = cardElement.querySelector('.edit-front').value;
        const newBack = cardElement.querySelector('.edit-back').value;
        const newSubjectId = editSubjectContainer.querySelector('select').value;
        const selectedTags = Array.from(editTagsContainer.querySelectorAll('input:checked')).map(i => i.value);
        const selectedColor = editColorContainer.querySelector('.color-swatch.selected')?.dataset.color;
        await apiUpdateCard(card._id, { front: newFront, back: newBack, subjectId: newSubjectId, tags: selectedTags, color: selectedColor });
        await _refreshUI();
    });

    actions.querySelector('.cancel-btn').addEventListener('click', () => {
        exitEditMode(cardElement, originalFront, originalBack);
    });
}

export function exitEditMode(cardElement, frontText, backText) {
    cardElement.classList.remove('editing');
    cardElement.draggable = true;
    const cardBody = cardElement.querySelector('.card-body');
    cardBody.querySelector('.front').innerHTML = frontText;
    cardBody.querySelector('.back').innerHTML = linkifyText(backText);
    cardBody.querySelector('.back').style.display = '';
    cardBody.querySelector('.card-actions').innerHTML = `
        <button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
        <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
    `;
    cardBody.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const cardData = state.cards.find(c => c._id === cardElement.id);
        toggleEditMode(cardElement, cardData);
    });
    cardBody.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this card?')) {
            await apiDeleteCard(cardElement.id);
            await _refreshUI();
        }
    });
}

export async function handleCreateCard(e) {
    e.preventDefault();
    const front = document.getElementById('card-front').value;
    const back = document.getElementById('card-back').value;
    const subjectId = document.getElementById('card-subject').value;
    const selectedTags = Array.from(_cardTagsContainer.querySelectorAll('input:checked')).map(i => i.value);
    const selectedColor = _createCardColorSelector.querySelector('.color-swatch.selected')?.dataset.color;

    if (!front || !back || !subjectId) {
        alert('Please fill out the front, back, and subject for the card.');
        return;
    }

    await apiCreateCard({ front, back, subjectId, tags: selectedTags, color: selectedColor });
    _createCardForm.reset();
    _createCardModal.hide();
    await _refreshUI();
}
