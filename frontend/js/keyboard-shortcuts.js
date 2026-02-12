// Keyboard shortcuts and enhanced interactions

/**
 * Initialize keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape key - Return to Map View
        if (e.key === 'Escape') {
            if (currentView !== VIEWS.MAP) {
                switchToView(VIEWS.MAP);
            }
        }

        // Number keys for quick view switching
        if (e.key === '1' && !isInputFocused()) {
            switchToView(VIEWS.MAP);
        }
        if (e.key === '2' && !isInputFocused()) {
            switchToView(VIEWS.ANALYTICS);
        }
        if (e.key === '3' && !isInputFocused()) {
            switchToView(VIEWS.ABOUT);
        }

        // Space bar - Toggle Map View panel when in map view
        if (e.key === ' ' && !isInputFocused() && currentView === VIEWS.MAP) {
            e.preventDefault();
            handleMapViewClick();
        }

        // Question mark - Show help
        if (e.key === '?' && !isInputFocused()) {
            showKeyboardHelp();
        }
    });

    // Add help button click handler
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', showKeyboardHelp);
    }

    console.log('⌨️ Keyboard shortcuts enabled! Press ? for help');
}

/**
 * Check if an input element has focus
 */
function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
    );
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardHelp() {
    // Create a custom help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'keyboard-help-modal';
    helpModal.innerHTML = `
        <div class="help-content">
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div class="shortcuts-grid">
                <div class="shortcut-item">
                    <kbd>ESC</kbd>
                    <span>Return to Map View</span>
                </div>
                <div class="shortcut-item">
                    <kbd>1</kbd>
                    <span>Map View</span>
                </div>
                <div class="shortcut-item">
                    <kbd>2</kbd>
                    <span>Analytics View</span>
                </div>
                <div class="shortcut-item">
                    <kbd>3</kbd>
                    <span>About View</span>
                </div>
                <div class="shortcut-item">
                    <kbd>SPACE</kbd>
                    <span>Toggle Panel (Map View)</span>
                </div>
                <div class="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show This Help</span>
                </div>
            </div>
            <button class="close-help-btn">Got it!</button>
        </div>
    `;

    document.body.appendChild(helpModal);

    // Fade in
    setTimeout(() => helpModal.classList.add('active'), 10);

    // Close on button click
    const closeBtn = helpModal.querySelector('.close-help-btn');
    closeBtn.addEventListener('click', () => {
        helpModal.classList.remove('active');
        setTimeout(() => helpModal.remove(), 300);
    });

    // Close on outside click
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('active');
            setTimeout(() => helpModal.remove(), 300);
        }
    });

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            helpModal.classList.remove('active');
            setTimeout(() => helpModal.remove(), 300);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}
