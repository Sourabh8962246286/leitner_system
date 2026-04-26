import { state } from './state.js';
import { createCardElement } from './cardEditor.js';
import { addDragAndDropListeners } from './dragDrop.js';
import { displayCardForReview } from './review.js';

let _leitnerContainer;

export function init(domRefs) {
    ({ leitnerContainer: _leitnerContainer } = domRefs);
}

export function renderBoxes() {
    _leitnerContainer.innerHTML = '';
    state.boxes.sort((a, b) => a.level - b.level).forEach(box => {
        const boxElement = document.createElement('div');
        boxElement.className = 'box';
        boxElement.dataset.boxId = box._id;
        boxElement.dataset.level = box.level;

        const boxHeader = document.createElement('div');
        boxHeader.className = 'box-header';

        const title = document.createElement('h3');
        title.textContent = box.title;

        const infoIcon = document.createElement('div');
        infoIcon.className = 'info-icon';
        infoIcon.textContent = 'i';

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = box.schedule.join(', ');

        infoIcon.appendChild(tooltip);
        boxHeader.appendChild(title);
        boxHeader.appendChild(infoIcon);
        boxElement.appendChild(boxHeader);
        _leitnerContainer.appendChild(boxElement);
    });
}

export function renderCards() {
    document.querySelectorAll('.box .card').forEach(card => card.remove());
    if (!state.cards || !state.boxes.length) return;

    state.cards.forEach(card => {
        const cardElement = createCardElement(card, { onCardClick: displayCardForReview });
        const boxId = card.currentBoxId.toString();
        const boxElement = document.querySelector(`[data-box-id="${boxId}"]`);
        if (boxElement) boxElement.appendChild(cardElement);
    });
    addDragAndDropListeners();
}
