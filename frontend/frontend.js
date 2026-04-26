import { state } from './modules/state.js';
import { apiFetchBoxes, apiFetchSubjects, apiFetchTags, apiFetchCards } from './modules/api.js';
import * as timer from './modules/timer.js';
import * as dragDrop from './modules/dragDrop.js';
import * as subjects from './modules/subjects.js';
import * as tags from './modules/tags.js';
import * as cardEditor from './modules/cardEditor.js';
import * as review from './modules/review.js';
import * as boxes from './modules/boxes.js';

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const leitnerContainer = document.getElementById('leitner-container');
    const cardStagingArea = document.getElementById('card-to-review');
    const correctBtn = document.getElementById('correct-btn');
    const incorrectBtn = document.getElementById('incorrect-btn');
    const createCardForm = document.getElementById('create-card-form');
    const createTagForm = document.getElementById('create-tag-form');
    const tagsList = document.getElementById('tags-list');
    const tagFilters = document.getElementById('tag-filters');
    const cardTagsContainer = document.getElementById('card-tags');
    const cardSubjectSelector = document.getElementById('card-subject-selector');
    const createCardColorSelector = document.getElementById('create-card-color-selector');
    const createCardModalEl = document.getElementById('create-card-modal');
    const createCardModal = new bootstrap.Modal(createCardModalEl);
    const createSubjectForm = document.getElementById('create-subject-form');
    const subjectsList = document.getElementById('subjects-list');
    const subjectFilter = document.getElementById('subject-filter');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const reviewTimer = document.getElementById('review-timer');
    const timerMinutesInput = document.getElementById('timer-minutes');
    const timerSecondsInput = document.getElementById('timer-seconds');
    const timerStartBtn = document.getElementById('timer-start-btn');
    const timerPauseBtn = document.getElementById('timer-pause-btn');
    const timerResetBtn = document.getElementById('timer-reset-btn');
    const timerDisplay = document.getElementById('timer-display');
    const showLogsBtn = document.getElementById('show-logs-btn');
    const cardLogsPanel = document.getElementById('card-logs-panel');
    const cardLogsStats = document.getElementById('card-logs-stats');
    const cardLogsList = document.getElementById('card-logs-list');

    // Dark Mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    darkModeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    });

    // refreshUI is defined before init calls so it can be passed as a callback
    async function refreshUI() {
        try {
            state.boxes = await apiFetchBoxes();
            state.subjects = await apiFetchSubjects();
            state.tags = await apiFetchTags();
            state.cards = await apiFetchCards();
        } catch (err) {
            console.error('Failed to refresh UI:', err);
            return;
        }
        boxes.renderBoxes();
        boxes.renderCards();
        subjects.renderSubjects();
        tags.renderAllTagElements();
        if (!state.currentReviewCard) {
            review.displayNextCardInQueue();
        }
    }

    // Initialize modules
    timer.init({ reviewTimer, timerMinutesInput, timerSecondsInput, timerStartBtn, timerPauseBtn, timerDisplay });
    dragDrop.init({ refreshUI });
    subjects.init({ subjectsList, subjectFilter }, { refreshUI });
    tags.init({ tagsList, tagFilters, cardTagsContainer }, { refreshUI });
    cardEditor.init({ cardTagsContainer, createCardColorSelector, createCardModal, createCardForm }, { refreshUI });
    review.init({ cardStagingArea, correctBtn, incorrectBtn, showLogsBtn, cardLogsPanel, cardLogsStats, cardLogsList }, { refreshUI });
    boxes.init({ leitnerContainer });

    // Event listeners
    correctBtn.addEventListener('click', () => { review.reviewAction(true); timer.resetTimer(); });
    incorrectBtn.addEventListener('click', () => { review.reviewAction(false); timer.resetTimer(); });
    createCardForm.addEventListener('submit', cardEditor.handleCreateCard);
    createTagForm.addEventListener('submit', tags.handleCreateTag);
    timerStartBtn.addEventListener('click', timer.startTimer);
    timerPauseBtn.addEventListener('click', timer.pauseTimer);
    timerResetBtn.addEventListener('click', timer.resetTimer);
    showLogsBtn.addEventListener('click', review.toggleCardLogs);
    createCardModalEl.addEventListener('show.bs.modal', () => {
        subjects.renderCardSubjectSelector(cardSubjectSelector, '', cardTagsContainer);
        cardEditor.renderColorSelector(createCardColorSelector);
    });
    createSubjectForm.addEventListener('submit', subjects.handleCreateSubject);
    subjectFilter.addEventListener('change', subjects.handleSubjectFilterChange);

    await refreshUI();
});
