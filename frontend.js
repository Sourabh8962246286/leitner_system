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
    const cardSubjectSelector = document.getElementById('card-subject-selector');
    const createCardColorSelector = document.getElementById('create-card-color-selector');
    const createCardModalEl = document.getElementById('create-card-modal');
    const manageTagsModalEl = document.getElementById('manage-tags-modal');
    const manageSubjectsModalEl = document.getElementById('manage-subjects-modal');
    const createCardModal = new bootstrap.Modal(createCardModalEl);
    const manageTagsModal = new bootstrap.Modal(manageTagsModalEl);
    const manageSubjectsModal = new bootstrap.Modal(manageSubjectsModalEl);
    const createSubjectForm = document.getElementById('create-subject-form');
    const subjectsList = document.getElementById('subjects-list');
    const subjectFilter = document.getElementById('subject-filter');

    // State
    const API_BASE_URL = 'https://leitner-system-2hz1.onrender.com';
    let cards = [];
    let boxes = [];
    let tags = [];
    let subjects = [];
    let activeSubjectId = '';
    let activeTagFilters = new Set();
    let currentReviewCard = null;
    let draggedCard = null;

    // --- Auth Wrapper for fetch ---
    async function fetchWithAuth(url, options = {}) {
        const token = window.auth.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            // TODO: Implement token refresh logic here
            console.error('Authentication error: Token might be expired.');
            window.auth.logout(); // Simple logout for now
            return; // Stop further execution
        }
        
        return response;
    }


    // --- Main Functions ---

    async function initializeApp() {
        addEventListeners();
        await refreshUI();
    }

    async function refreshUI() {
        await fetchBoxes();
        await fetchSubjects();
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
        
        createCardModalEl.addEventListener('show.bs.modal', () => {
            renderCardSubjectSelector(cardSubjectSelector);
            renderColorSelector(createCardColorSelector);
        });

        createSubjectForm.addEventListener('submit', handleCreateSubject);
        subjectFilter.addEventListener('change', handleSubjectFilterChange);
    }
    
    // --- Data Fetching ---

    async function fetchBoxes() {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/boxes`);
            if (!response.ok) throw new Error('Failed to fetch boxes');
            boxes = await response.json();
            renderBoxes();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchTags() {
        try {
            const url = activeSubjectId 
                ? `${API_BASE_URL}/tags?subjectId=${activeSubjectId}`
                : `${API_BASE_URL}/tags`;
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error('Failed to fetch tags');
            tags = await response.json();
            renderAllTagElements();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchCards() {
        try {
            const tagFilterQuery = Array.from(activeTagFilters).join(',');
            const params = new URLSearchParams();
            if (tagFilterQuery) {
                params.append('tags', tagFilterQuery);
            }
            if (activeSubjectId) {
                params.append('subjectId', activeSubjectId);
            }
            const url = `${API_BASE_URL}/cards?${params.toString()}`;
            const response = await fetchWithAuth(url);
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

            // Create a header for title and info icon
            const boxHeader = document.createElement('div');
            boxHeader.className = 'box-header';

            const title = document.createElement('h3');
            title.textContent = box.title;

            // Create info icon and tooltip
            const infoIcon = document.createElement('div');
            infoIcon.className = 'info-icon';
            infoIcon.textContent = 'i';
            
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = box.schedule.join(', '); // Join schedule array for display

            infoIcon.appendChild(tooltip);
            boxHeader.appendChild(title);
            boxHeader.appendChild(infoIcon);
            
            boxElement.appendChild(boxHeader);
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
    
    function renderSubjects() {
        subjectsList.innerHTML = '';
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `<span>${subject.name}</span><button class="btn-close" data-subject-id="${subject._id}"></button>`;
            subjectsList.appendChild(li);
        });
        document.querySelectorAll('.btn-close').forEach(btn => {
            btn.addEventListener('click', handleDeleteSubject);
        });
        renderSubjectFilter();
    }

    function renderSubjectFilter() {
        const selectedValue = subjectFilter.value;
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject._id;
            option.textContent = subject.name;
            subjectFilter.appendChild(option);
        });
        subjectFilter.value = selectedValue;
    }

    function handleSubjectFilterChange() {
        activeSubjectId = subjectFilter.value;
        activeTagFilters.clear(); // Reset tag filters when subject changes
        refreshUI();
    }


    async function handleCreateSubject(e) {
        e.preventDefault();
        const subjectNameInput = document.getElementById('subject-name');
        const name = subjectNameInput.value;
        if (!name) return;

        await createSubject({ name });
        subjectNameInput.value = '';
        await fetchSubjects();
    }

    async function handleDeleteSubject(e) {
        const subjectId = e.target.dataset.subjectId;
        if (confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
            await deleteSubject(subjectId);
            await fetchSubjects(); // Refresh the list after deletion
        }
    }

    function renderAllTagElements() {
        renderTagList();
        renderTagFilters();
        renderTagCheckboxes(cardTagsContainer, tags);
    }

    function renderCardSubjectSelector(container, selectedSubjectId = '') {
        container.innerHTML = '<label for="card-subject" class="form-label">Subject</label>';
        const select = document.createElement('select');
        select.id = 'card-subject';
        select.className = 'form-select';
        select.required = true;
        
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject._id;
            option.textContent = subject.name;
            select.appendChild(option);
        });

        if (selectedSubjectId) {
            select.value = selectedSubjectId;
        } else if (activeSubjectId) {
            select.value = activeSubjectId;
        }

        // When the subject changes, fetch and render the tags for that subject
        select.addEventListener('change', async () => {
            const subjectId = select.value;
            if (subjectId) {
                const response = await fetchWithAuth(`${API_BASE_URL}/tags?subjectId=${subjectId}`);
                const subjectTags = await response.json();
                renderTagCheckboxes(cardTagsContainer, subjectTags);
            } else {
                renderTagCheckboxes(cardTagsContainer, []);
            }
        });

        // Trigger the change event initially to load tags for the default subject
        select.dispatchEvent(new Event('change'));

        container.appendChild(select);
    }

    function renderColorSelector(container, selectedCardColor = '') {
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
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `<span>${tag.name}</span><button class="btn-close delete-tag-btn" data-tag-id="${tag._id}"></button>`;
            tagsList.appendChild(li);
        });
        document.querySelectorAll('.delete-tag-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteTag);
        });
    }

    function renderTagFilters() {
        tagFilters.innerHTML = '';
        tags.forEach(tag => {
            const div = document.createElement('div');
            div.className = 'form-check';
            div.innerHTML = `<input class="form-check-input" type="checkbox" value="${tag._id}" id="tag-filter-${tag._id}">
                             <label class="form-check-label" for="tag-filter-${tag._id}">${tag.name}</label>`;
            tagFilters.appendChild(div);
        });
        tagFilters.querySelectorAll('input').forEach(checkbox => {
            checkbox.addEventListener('change', handleFilterChange);
        });
    }

    function renderCardTagCheckboxes(tagsToRender = [], cardTags = []) {
        cardTagsContainer.innerHTML = '<h6>Tags</h6>';
        if (!tagsToRender.length) return;
        
        tagsToRender.forEach(tag => {
            const isChecked = cardTags.includes(tag._id);
            const div = document.createElement('div');
            div.className = 'form-check form-check-inline';
            div.innerHTML = `<input class="form-check-input" type="checkbox" name="tags" value="${tag._id}" id="card-tag-${tag._id}" ${isChecked ? 'checked' : ''}>
                             <label class="form-check-label" for="card-tag-${tag._id}">${tag.name}</label>`;
            cardTagsContainer.appendChild(div);
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
            <div class="card-body">
                <div class="front">${card.front}</div>
                <div class="back">${card.back}</div>
                <div class="card-tag-display text-muted small">${tagNames}</div>
                <div class="card-actions text-end mt-2">
                    <button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
                    <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                </div>
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
    
    async function toggleEditMode(cardElement, card) {
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
        
        // Fetch the tags for the specific subject of the card
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
            const selectedTags = Array.from(editTagsContainer.querySelectorAll('input:checked')).map(input => input.value);
            const selectedColor = editColorContainer.querySelector('.color-swatch.selected')?.dataset.color;
            await updateCard(card._id, { front: newFront, back: newBack, subjectId: newSubjectId, tags: selectedTags, color: selectedColor });
            await refreshUI();
        });

        actions.querySelector('.cancel-btn').addEventListener('click', () => {
            exitEditMode(cardElement, originalFront, originalBack);
        });
    }

    function renderTagCheckboxes(container, tagsToRender = [], checkedTags = []) {
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

    function exitEditMode(cardElement, frontText, backText) {
        cardElement.classList.remove('editing');
        cardElement.draggable = true;
        const cardBody = cardElement.querySelector('.card-body');
        cardBody.querySelector('.front').innerHTML = frontText;
        cardBody.querySelector('.back').innerHTML = backText;
        cardBody.querySelector('.back').style.display = '';
        cardBody.querySelector('.card-actions').innerHTML = `
            <button class="btn btn-sm btn-outline-secondary edit-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        `;
        // Re-attach listeners since we overwrote the HTML
        cardBody.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const cardData = cards.find(c => c._id === cardElement.id);
            toggleEditMode(cardElement, cardData);
        });
        cardBody.querySelector('.delete-btn').addEventListener('click', async (e) => {
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
            cardStagingArea.innerHTML = '<p class="text-center text-muted">No cards to review!</p>';
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
        const subjectId = document.getElementById('card-subject').value;
        const selectedTags = Array.from(cardTagsContainer.querySelectorAll('input:checked')).map(input => input.value);
        const selectedColor = createCardColorSelector.querySelector('.color-swatch.selected')?.dataset.color;
        
        if (!front || !back || !subjectId) {
            alert('Please fill out the front, back, and subject for the card.');
            return;
        }
        
        await createCard({ front, back, subjectId, tags: selectedTags, color: selectedColor });
        
        createCardForm.reset();
        createCardModal.hide();
        await refreshUI();
    }
    
    async function handleCreateTag(e) {
        e.preventDefault();
        if (!activeSubjectId) {
            alert('Please select a subject first before creating a tag.');
            return;
        }
        const tagNameInput = document.getElementById('tag-name');
        const name = tagNameInput.value;
        if (!name) return;

        await createTag({ name, subjectId: activeSubjectId });
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
            const response = await fetchWithAuth(`${API_BASE_URL}/cards`, {
                method: 'POST',
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
            const response = await fetchWithAuth(`${API_BASE_URL}/cards/${cardId}`, {
                method: 'PATCH',
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
            const response = await fetchWithAuth(`${API_BASE_URL}/cards/${cardId}`, {
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
            const response = await fetchWithAuth(`${API_BASE_URL}/tags`, {
                method: 'POST',
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
            const response = await fetchWithAuth(`${API_BASE_URL}/tags/${tagId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete tag');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchSubjects() {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/subjects`);
            if (!response.ok) throw new Error('Failed to fetch subjects');
            subjects = await response.json();
            renderSubjects();
        } catch (error) {
            console.error(error);
        }
    }

    async function createSubject(subjectData) {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/subjects`, {
                method: 'POST',
                body: JSON.stringify(subjectData),
            });
            if (!response.ok) throw new Error('Failed to create subject');
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteSubject(subjectId) {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/subjects/${subjectId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const err = await response.json();
                alert(err.message); // Show the specific error from the backend
                throw new Error('Failed to delete subject');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }


    async function handleCardReview(cardId, isCorrect) {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/cards/review`, {
                method: 'POST',
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
