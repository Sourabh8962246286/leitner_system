import { state } from './state.js';
import { apiHandleCardReview, apiFetchCardLogs } from './api.js';
import { showTimerUI, hideTimerUI, resetTimer } from './timer.js';
import { createCardElement } from './cardEditor.js';

let _cardStagingArea, _correctBtn, _incorrectBtn, _showLogsBtn;
let _cardLogsPanel, _cardLogsStats, _cardLogsList;
let _refreshUI;

export function init(domRefs, callbacks) {
    ({
        cardStagingArea: _cardStagingArea,
        correctBtn: _correctBtn,
        incorrectBtn: _incorrectBtn,
        showLogsBtn: _showLogsBtn,
        cardLogsPanel: _cardLogsPanel,
        cardLogsStats: _cardLogsStats,
        cardLogsList: _cardLogsList,
    } = domRefs);
    ({ refreshUI: _refreshUI } = callbacks);
}

export function displayCardForReview(card) {
    state.currentReviewCard = card;
    _cardStagingArea.innerHTML = '';
    const cardElement = createCardElement(card, { isForReview: true });

    cardElement.draggable = false;
    cardElement.querySelector('.card-actions').style.display = 'none';

    cardElement.addEventListener('click', (e) => {
        if (e.target.closest('.card-actions') || cardElement.classList.contains('editing')) return;
        if (!cardElement.classList.contains('revealed')) {
            if (confirm('Are you sure you want to see the answer?')) {
                cardElement.classList.add('revealed');
            }
        }
    });

    _cardStagingArea.appendChild(cardElement);
    _correctBtn.style.display = 'inline-block';
    _incorrectBtn.style.display = 'inline-block';
    _showLogsBtn.style.display = 'inline-block';
    hideCardLogs();
    showTimerUI();
    resetTimer();
}

export function displayNextCardInQueue() {
    hideCardLogs();
    const reviewableCards = state.cards.filter(card => {
        const box = state.boxes.find(b => b._id.toString() === card.currentBoxId.toString());
        const maxLevel = Math.max(...state.boxes.map(b => b.level), 0);
        return box && box.level < maxLevel;
    });

    if (reviewableCards.length > 0) {
        displayCardForReview(reviewableCards[0]);
    } else {
        _cardStagingArea.innerHTML = '<p class="text-center text-muted">No cards to review!</p>';
        _correctBtn.style.display = 'none';
        _incorrectBtn.style.display = 'none';
        hideTimerUI();
        resetTimer();
        state.currentReviewCard = null;
    }
}

export async function reviewAction(isCorrect) {
    if (!state.currentReviewCard) return;
    const timeSpent = state.timerInitial > 0 ? (state.timerInitial - state.timerRemaining) : 0;
    console.log(`Timer registered: ${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s (Initial: ${state.timerInitial}s, Remaining: ${state.timerRemaining}s)`);
    await apiHandleCardReview(state.currentReviewCard._id, isCorrect, timeSpent);
    hideCardLogs();
    await _refreshUI();
}

export function toggleCardLogs() {
    state.logsVisible = !state.logsVisible;
    if (state.logsVisible) loadAndRenderCardLogs();
    _cardLogsPanel.style.display = state.logsVisible ? 'block' : 'none';
    _showLogsBtn.textContent = state.logsVisible ? '📋 Hide Logs' : '📋 Logs';
}

export function hideCardLogs() {
    state.logsVisible = false;
    _cardLogsPanel.style.display = 'none';
    _showLogsBtn.textContent = '📋 Logs';
}

async function loadAndRenderCardLogs() {
    if (!state.currentReviewCard) return;
    const logs = await apiFetchCardLogs(state.currentReviewCard._id);
    renderCardLogs(logs);
}

function renderCardLogs(logs) {
    const totalReviews = logs.length;
    const correctCount = logs.filter(l => l.isCorrect).length;
    const incorrectCount = totalReviews - correctCount;
    const successRate = totalReviews > 0 ? Math.round((correctCount / totalReviews) * 100) : 0;
    const totalTimeSpent = logs.reduce((sum, l) => sum + l.timeSpent, 0);
    const totalMinutes = Math.floor(totalTimeSpent / 60);
    const totalSeconds = totalTimeSpent % 60;

    _cardLogsStats.innerHTML = `
        <div class="d-flex flex-wrap gap-2 text-center small">
            <span><strong>${totalReviews}</strong> reviews</span> |
            <span class="text-success"><strong>${correctCount}</strong> ✅</span> |
            <span class="text-danger"><strong>${incorrectCount}</strong> ❌</span> |
            <span><strong>${successRate}%</strong> success</span> |
            <span><strong>${totalMinutes}m ${totalSeconds}s</strong> total</span>
        </div>
    `;

    if (logs.length === 0) {
        _cardLogsList.innerHTML = '<p class="text-center text-muted small mb-0">No review history yet.</p>';
        return;
    }

    _cardLogsList.innerHTML = logs.map(log => {
        const date = new Date(log.reviewedAt);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const resultIcon = log.isCorrect ? '✅' : '❌';
        const timeStr2 = log.timeSpent > 0 ? `${Math.floor(log.timeSpent / 60)}m ${log.timeSpent % 60}s` : 'No timer';
        const boxMovement = `Box ${log.previousBoxLevel} → Box ${log.newBoxLevel}`;
        return `
            <div class="d-flex justify-content-between align-items-start py-1 border-bottom">
                <div class="small">
                    <span>${resultIcon}</span>
                    <span class="ms-2">${dateStr} ${timeStr}</span>
                    <span class="ms-2 text-muted">${boxMovement}</span>
                </div>
                <span class="small text-muted">${timeStr2}</span>
            </div>
        `;
    }).join('');
}
