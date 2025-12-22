
document.addEventListener('DOMContentLoaded', () => {
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
    const createCardColorSelector = document.getElementById('create-card-color-selector');
    const modalOverlay = document.getElementById('modal-overlay');
    const createCardModal = document.getElementById('create-card-modal');
    const openCreateCardBtn = document.getElementById('open-create-card-modal');
    const closeCreateCardBtn = createCardModal.querySelector('.close-btn'); // Use a specific close button for createCardModal
    const manageTagsModal = document.getElementById('manage-tags-modal');
    const openManageTagsBtn = document.getElementById('open-manage-tags-modal');
    const closeManageTagsBtn = manageTagsModal.querySelector('.close-btn'); // Use a specific close button for manageTagsModal

    // State
    const API_BASE_URL = 'http://localhost:3000';
    let cards = [];
    let boxes = [];
    let tags = [];
    let activeTagFilters = new Set();
    let currentReviewCard = null;
    let draggedCard = null;

    // --- Main Functions ---

    async function initializeApp() {
        addEventListeners();
        await refreshUI();
    }

    async function refreshUI() {
        await fetchBoxes();
        await fetchTags();
        await fetchCards();
        addDragAndDropListeners();
        if (!currentReviewCard) {
            displayNextCardInQueue();
        }
    }

    function addEventListeners() {
        correctBtn.addEventListener('click', () => reviewAction(true));
        incorrectBtn.addEventListener('click', () => reviewAction(false));
        createCardForm.addEventListener('submit', handleCreateCard);
        createTagForm.addEventListener('submit', handleCreateTag);
        
        openCreateCardBtn.addEventListener('click', () => openModal(createCardModal));
        closeCreateCardBtn.addEventListener('click', () => closeModal(createCardModal));

        openManageTagsBtn.addEventListener('click', () => openModal(manageTagsModal));
        closeManageTagsBtn.addEventListener('click', () => closeModal(manageTagsModal));

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                // Close all modals if clicking outside
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') { // Check if modal is actually open
                        closeModal(modal);
                    }
                });
            }
        });
    }

    // Generic modal open/close functions
    function openModal(modalElement) {
        if (modalElement === createCardModal) {
            renderColorSelector(createCardColorSelector);
        }
        modalOverlay.style.display = 'flex';
        modalElement.style.display = 'block';
    }

    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        const anyModalOpen = document.querySelector('.modal[style*="display: block"]');
        if (!anyModalOpen) {
            modalOverlay.style.display = 'none';
        }
    }
    
    // --- Data Fetching ---

    async function fetchBoxes() {
        try {
            const response = await fetch(`${API_BASE_URL}/boxes`);
            if (!response.ok) throw new Error('Failed to fetch boxes');
            boxes = await response.json();
            renderBoxes();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchTags() {
        try {
            const response = await fetch(`${API_BASE_URL}/tags`);
            if (!response.ok) throw new Error('Failed to fetch tags');
            tags = await response.json();
            renderAllTagElements();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchCards() {
        try {
            const filterQuery = Array.from(activeTagFilters).join(',');
            const url = filterQuery ? `${API_BASE_URL}/cards?tags=${filterQuery}` : `${API_BASE_URL}/cards`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch cards');
            cards = await response.json();
            renderCards();
        } catch (error) {
            console.error('Failed to fetch cards:', error);
        }
    }
    
    // --- Rendering ---

    function renderBoxes() {
        leitnerContainer.innerHTML = '';
        boxes.sort((a, b) => a.level - b.level).forEach(box => {
            const boxElement = document.createElement('div');
            boxElement.className = 'box';
            boxElement.dataset.boxId = box._id;
            boxElement.dataset.level = box.level;
            boxElement.innerHTML = `<h3>${box.title}</h3>`;
            leitnerContainer.appendChild(boxElement);
        });
    }

    function renderCards() {
        document.querySelectorAll('.box .card').forEach(card => card.remove());
        if (!cards || !boxes.length) return;

        cards.forEach(card => {
            const cardElement = createCardElement(card);
            const boxId = card.currentBoxId.toString();
            const boxElement = document.querySelector(`[data-box-id="${boxId}"]`);
            if (boxElement) {
                boxElement.appendChild(cardElement);
            }
        });
        addDragAndDropListeners();
    }
    
    function renderAllTagElements() {
        renderTagList();
        renderTagFilters();
        renderCardTagCheckboxes();
    }

    function renderColorSelector(container, selectedCardColor = '') {
        container.innerHTML = '<h4>Color:</h4>';
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
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                swatch.classList.add('selected');
            });
            colorTray.appendChild(swatch);
        });
        container.appendChild(colorTray);
    }


    function renderTagList() {
        tagsList.innerHTML = '';
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${tag.name}</span><button class="delete-tag-btn" data-tag-id="${tag._id}">x</button>`;
            tagsList.appendChild(li);
        });
        document.querySelectorAll('.delete-tag-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteTag);
        });
    }

    function renderTagFilters() {
        tagFilters.innerHTML = '';
        tags.forEach(tag => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${tag._id}">${tag.name}`;
            tagFilters.appendChild(label);
        });
        tagFilters.querySelectorAll('input').forEach(checkbox => {
            checkbox.addEventListener('change', handleFilterChange);
        });
    }

    function renderCardTagCheckboxes(cardTags = []) {
        cardTagsContainer.innerHTML = '<h4>Tags:</h4>';
        tags.forEach(tag => {
            const isChecked = cardTags.includes(tag._id);
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="tags" value="${tag._id}" ${isChecked ? 'checked' : ''}>${tag.name}`;
            cardTagsContainer.appendChild(label);
        });
    }

    function createCardElement(card, isForReview = false) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.id = card._id;
        cardElement.draggable = true;
        if (card.color) {
            cardElement.style.backgroundColor = card.color;
        }

        const tagNames = (card.tags && Array.isArray(card.tags))
            ? card.tags.map(tagId => `#${tags.find(t => t._id === tagId)?.name}`).filter(Boolean).join(' ')
            : '';

        cardElement.innerHTML = `
            <div class="card-content">
                <div class="front">${card.front}</div>
                <div class="back">${card.back}</div>
                <div class="card-tag-display">${tagNames}</div>
            </div>
            <div class="card-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        if (!isForReview) {
            cardElement.addEventListener('click', (e) => {
                if (e.target.closest('.card-actions') || cardElement.classList.contains('editing')) return;
                displayCardForReview(card);
            });
        }

        cardElement.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Are you sure?')) {
                await deleteCard(card._id);
                await refreshUI();
            }
        });
        
        cardElement.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEditMode(cardElement, card);
        });
        
        return cardElement;
    }
    
    function toggleEditMode(cardElement, card) {
        cardElement.classList.add('editing');
        cardElement.draggable = false;
        const front = cardElement.querySelector('.front');
        const back = cardElement.querySelector('.back');
        const actions = cardElement.querySelector('.card-actions');
        
        const originalFront = front.textContent;
        const originalBack = back.textContent;

        front.innerHTML = `<textarea class="edit-front">${originalFront}</textarea>`;
        back.innerHTML = `<textarea class="edit-back">${originalBack}</textarea>`;
        
        const editTagsContainer = document.createElement('div');
        editTagsContainer.className = 'card-tags-edit';
        
        tags.forEach(tag => {
            const isChecked = card.tags.includes(tag._id);
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${tag._id}" ${isChecked ? 'checked' : ''}>${tag.name}`;
            editTagsContainer.appendChild(label);
        });
        
        const editColorContainer = document.createElement('div');
        editColorContainer.className = 'card-color-edit';
        renderColorSelector(editColorContainer, card.color);
        
        back.appendChild(editTagsContainer);
        back.appendChild(editColorContainer);
        back.style.display = 'block';

        actions.innerHTML = `
            <button class="save-btn">Save</button>
            <button class="cancel-btn">Cancel</button>
        `;

        actions.querySelector('.save-btn').addEventListener('click', async () => {
            const newFront = cardElement.querySelector('.edit-front').value;
            const newBack = cardElement.querySelector('.edit-back').value;
            const selectedTags = Array.from(editTagsContainer.querySelectorAll('input:checked')).map(input => input.value);
            const selectedColor = editColorContainer.querySelector('.color-swatch.selected')?.dataset.color;
            await updateCard(card._id, { front: newFront, back: newBack, tags: selectedTags, color: selectedColor });
            await refreshUI();
        });

        actions.querySelector('.cancel-btn').addEventListener('click', () => {
            exitEditMode(cardElement, originalFront, originalBack);
        });
    }

    function exitEditMode(cardElement, frontText, backText) {
        cardElement.classList.remove('editing');
        cardElement.draggable = true;
        cardElement.querySelector('.front').innerHTML = frontText;
        cardElement.querySelector('.back').innerHTML = backText;
        cardElement.querySelector('.back').style.display = '';
        cardElement.querySelector('.card-actions').innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        // Re-attach listeners since we overwrote the HTML
        cardElement.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const cardData = cards.find(c => c._id === cardElement.id);
            toggleEditMode(cardElement, cardData);
        });
        cardElement.querySelector('.delete-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this card?')) {
                await deleteCard(cardElement.id);
                await refreshUI();
            }
        });
    }

    function displayCardForReview(card) {
        currentReviewCard = card;
        cardStagingArea.innerHTML = '';
        const cardElement = createCardElement(card, true); // Pass true for isForReview
        
        cardElement.draggable = false;
        cardElement.querySelector('.card-actions').style.display = 'none';
        
        // Add the click listener for revealing the answer
        cardElement.addEventListener('click', (e) => {
            if (e.target.closest('.card-actions') || cardElement.classList.contains('editing')) return;
            
            if (!cardElement.classList.contains('revealed')) {
                if (confirm('Are you sure you want to see the answer?')) {
                    cardElement.classList.add('revealed');
                }
            }
        });
        
        cardStagingArea.appendChild(cardElement);
        correctBtn.style.display = 'inline-block';
        incorrectBtn.style.display = 'inline-block';
    }

    function displayNextCardInQueue() {
        const reviewableCards = cards.filter(card => {
            const box = boxes.find(b => b._id.toString() === card.currentBoxId.toString());
            const maxLevel = Math.max(...boxes.map(b => b.level), 0);
            return box && box.level < maxLevel;
        });

        if (reviewableCards.length > 0) {
            const nextCard = reviewableCards[0];
            displayCardForReview(nextCard);
        } else {
            cardStagingArea.innerHTML = '<p>No cards to review!</p>';
            correctBtn.style.display = 'none';
            incorrectBtn.style.display = 'none';
            currentReviewCard = null;
        }
    }

    async function reviewAction(isCorrect) {
        if (!currentReviewCard) return;

        await handleCardReview(currentReviewCard._id, isCorrect);
        await refreshUI();
    }

    async function handleCreateCard(e) {
        e.preventDefault();
        const front = document.getElementById('card-front').value;
        const back = document.getElementById('card-back').value;
        const selectedTags = Array.from(cardTagsContainer.querySelectorAll('input:checked')).map(input => input.value);
        const selectedColor = createCardColorSelector.querySelector('.color-swatch.selected')?.dataset.color;
        
        if (!front || !back) return;
        
        await createCard({ front, back, tags: selectedTags, color: selectedColor });
        
        createCardForm.reset();
        closeModal(createCardModal);
        await refreshUI();
    }
    
    async function handleCreateTag(e) {
        e.preventDefault();
        const tagNameInput = document.getElementById('tag-name');
        const name = tagNameInput.value;
        if (!name) return;

        await createTag({ name });
        tagNameInput.value = '';
        await fetchTags();
    }

    async function handleDeleteTag(e) {
        const tagId = e.target.dataset.tagId;
        if (confirm('Are you sure you want to delete this tag?')) {
            await deleteTag(tagId);
            await refreshUI();
        }
    }
    
    async function handleFilterChange(e) {
        const tagId = e.target.value;
        if (e.target.checked) {
            activeTagFilters.add(tagId);
        } else {
            activeTagFilters.delete(tagId);
        }
        await fetchCards();
    }
    
    // --- API Functions ---
    
    async function createCard(cardData) {
        try {
            const response = await fetch(`${API_BASE_URL}/cards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardData),
            });
            if (!response.ok) throw new Error('Failed to create card');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    
    async function updateCard(cardId, cardData) {
        try {
            const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cardData),
            });
            if (!response.ok) throw new Error('Failed to update card');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteCard(cardId) {
       try {
            const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete card');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function createTag(tagData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tagData),
            });
            if (!response.ok) throw new Error('Failed to create tag');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTag(tagId) {
        try {
            const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete tag');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCardReview(cardId, isCorrect) {
        try {
            const response = await fetch(`${API_BASE_URL}/cards/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId, isCorrect }),
            });
            if (!response.ok) throw new Error('Failed to review card');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // --- Drag and Drop ---
    function addDragAndDropListeners() {
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
        draggedCard = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }
    
    function onDragEnd(e) {
        e.target.classList.remove('dragging');
        draggedCard = null;
    }
    
    function onDragOver(e) {
        e.preventDefault();
        if (e.currentTarget.contains(draggedCard)) return;
        e.currentTarget.classList.add('drag-over');
    }
    
    function onDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }
    
    async function onDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        if (!draggedCard) return;

        const fromBox = draggedCard.closest('.box');
        const toBox = e.currentTarget;

        if (fromBox.dataset.boxId === toBox.dataset.boxId) return;

        const isCorrect = parseInt(toBox.dataset.level) > parseInt(fromBox.dataset.level);
        
        await handleCardReview(draggedCard.id, isCorrect);
        await refreshUI();
    }

    // Initial Load
    initializeApp();
});
