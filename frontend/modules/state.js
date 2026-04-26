export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const state = {
    cards: [],
    boxes: [],
    tags: [],
    subjects: [],
    activeSubjectId: '',
    activeTagFilters: new Set(),
    currentReviewCard: null,
    draggedCard: null,
    logsVisible: false,
    timerInterval: null,
    timerRemaining: 0,
    timerInitial: 0,
    timerRunning: false,
    timerExpired: false,
};
