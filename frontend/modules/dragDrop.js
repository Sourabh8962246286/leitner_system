import { state } from './state.js';
import { apiHandleCardReview } from './api.js';

let _refreshUI;

export function init(callbacks) {
    ({ refreshUI: _refreshUI } = callbacks);
}

export function addDragAndDropListeners() {
    document.querySelectorAll('.card[draggable="true"]').forEach(card => {
        card.addEventListener('dragstart', onDragStart);
        card.addEventListener('dragend', onDragEnd);
    });
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('dragover', onDragOver);
        box.addEventListener('dragleave', onDragLeave);
        box.addEventListener('drop', onDrop);
    });
}

function onDragStart(e) {
    if (e.target.classList.contains('editing')) {
        e.preventDefault();
        return;
    }
    state.draggedCard = e.target;
    setTimeout(() => e.target.classList.add('dragging'), 0);
}

function onDragEnd(e) {
    e.target.classList.remove('dragging');
    state.draggedCard = null;
}

function onDragOver(e) {
    e.preventDefault();
    if (e.currentTarget.contains(state.draggedCard)) return;
    e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

async function onDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!state.draggedCard) return;

    const fromBox = state.draggedCard.closest('.box');
    const toBox = e.currentTarget;
    if (fromBox.dataset.boxId === toBox.dataset.boxId) return;

    const isCorrect = parseInt(toBox.dataset.level) > parseInt(fromBox.dataset.level);
    await apiHandleCardReview(state.draggedCard.id, isCorrect, 0);
    await _refreshUI();
}
