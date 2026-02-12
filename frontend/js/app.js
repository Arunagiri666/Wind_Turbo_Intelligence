// Main Application Entry Point

/**
 * Initialize application
 */
async function initializeApp() {
    console.log('Initializing Turbo Wind Intelligence Portal...');

    try {
        // Initialize Leaflet Map
        initializeMap();

        // Initialize wind visualization
        initializeWindVisualization();

        // Initialize territory layer
        await initializeTerritoryLayer();

        // Initialize navigation system
        initializeNavigation();

        // Initialize analytics charts
        initializeAnalytics();

        // Initialize keyboard shortcuts
        if (typeof initializeKeyboardShortcuts === 'function') {
            initializeKeyboardShortcuts();
        }

        // Initialize UI listeners
        initializeUIListeners();

        // Check for shared link
        const sharedData = parseSharedLink();
        if (sharedData) {
            console.log('Loading shared location:', sharedData);
            panToLocation(sharedData.lat, sharedData.lon, 10);

            // Fetch wind data
            const windData = await apiClient.getCurrentWindData(sharedData.lat, sharedData.lon);
            updateWindDataDisplay(windData);
            addMarker(sharedData.lat, sharedData.lon, sharedData.location);
        }

        console.log('Application initialized successfully!');
        showToast('Welcome to Turbo Wind Intelligence Portal!');

    } catch (error) {
        console.error('Error initializing application:', error);
        showToast('Error initializing application. Please refresh the page.', 'error');
    }
}

/**
 * Wait for DOM to be ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * Handle window unload
 */
window.addEventListener('beforeunload', () => {
    stopWindVisualization();
});

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

/**
 * Handle online/offline status
 */
window.addEventListener('online', () => {
    showToast('Connection restored');
});

window.addEventListener('offline', () => {
    showToast('No internet connection', 'error');
});

console.log('Turbo Wind Intelligence Portal loaded');
