import { state } from './state.js';

let _reviewTimer, _timerMinutesInput, _timerSecondsInput;
let _timerStartBtn, _timerPauseBtn, _timerDisplay;

export function init(domRefs) {
    ({
        reviewTimer: _reviewTimer,
        timerMinutesInput: _timerMinutesInput,
        timerSecondsInput: _timerSecondsInput,
        timerStartBtn: _timerStartBtn,
        timerPauseBtn: _timerPauseBtn,
        timerDisplay: _timerDisplay,
    } = domRefs);
}

export function showTimerUI() {
    _reviewTimer.style.display = 'block';
}

export function hideTimerUI() {
    _reviewTimer.style.display = 'none';
}

export function startTimer() {
    if (state.timerRunning) return;

    const mins = parseInt(_timerMinutesInput.value) || 0;
    const secs = parseInt(_timerSecondsInput.value) || 0;

    if (!state.timerExpired && state.timerRemaining > 0) {
        startInterval();
        return;
    }

    if (mins === 0 && secs === 0) {
        alert('Please set a time first.');
        return;
    }

    state.timerRemaining = mins * 60 + secs;
    state.timerInitial = state.timerRemaining;
    state.timerExpired = false;
    _timerDisplay.classList.remove('expired');
    startInterval();
}

export function startInterval() {
    state.timerRunning = true;
    _timerStartBtn.disabled = true;
    _timerPauseBtn.disabled = false;
    _timerMinutesInput.disabled = true;
    _timerSecondsInput.disabled = true;

    state.timerInterval = setInterval(() => {
        state.timerRemaining--;
        if (state.timerRemaining <= 0) {
            state.timerRemaining = 0;
            clearInterval(state.timerInterval);
            state.timerRunning = false;
            state.timerExpired = true;
            _timerDisplay.classList.add('expired');
            _timerStartBtn.disabled = false;
            _timerPauseBtn.disabled = true;
            _timerMinutesInput.disabled = false;
            _timerSecondsInput.disabled = false;
            timerFlash();
        }
        updateTimerDisplay();
    }, 1000);
    updateTimerDisplay();
}

export function pauseTimer() {
    if (!state.timerRunning) return;
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    _timerStartBtn.disabled = false;
    _timerPauseBtn.disabled = true;
}

export function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timerRemaining = 0;
    state.timerInitial = 0;
    state.timerExpired = false;
    _timerMinutesInput.disabled = false;
    _timerSecondsInput.disabled = false;
    _timerStartBtn.disabled = false;
    _timerPauseBtn.disabled = true;
    _timerDisplay.classList.remove('expired');
    _timerMinutesInput.value = '';
    _timerSecondsInput.value = '';
    updateTimerDisplay();
}

export function updateTimerDisplay() {
    const mins = Math.floor(state.timerRemaining / 60);
    const secs = state.timerRemaining % 60;
    _timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function timerFlash() {
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        _timerDisplay.style.visibility = _timerDisplay.style.visibility === 'hidden' ? 'visible' : 'hidden';
        flashCount++;
        if (flashCount >= 6) {
            clearInterval(flashInterval);
            _timerDisplay.style.visibility = 'visible';
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                osc.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch (e) { /* ignore */ }
        }
    }, 300);
}
