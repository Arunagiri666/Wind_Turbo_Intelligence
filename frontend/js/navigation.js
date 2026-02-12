// Navigation Controller for View Switching
let currentView = 'map';
let mapViewState = 'full'; // 'full' or 'shrunk'

const VIEWS = {
    MAP: 'map',
    ANALYTICS: 'analytics',
    ABOUT: 'about'
};

/**
 * Initialize navigation system
 */
function initializeNavigation() {
    console.log('Initializing navigation system...');

    // Get navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');

    // Add click handlers
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            handleNavigationClick(view);
        });
    });

    // Initialize default view
    switchToView(VIEWS.MAP);

    console.log('Navigation system initialized');
}

/**
 * Handle navigation button click
 */
function handleNavigationClick(view) {
    if (view === VIEWS.MAP) {
        handleMapViewClick();
    } else {
        switchToView(view);
    }
}

/**
 * Handle Map View button click - Toggle Wind Intelligence widget expand/shrink
 */
function handleMapViewClick() {
    const controlPanel = document.querySelector('.control-panel');
    const panelContent = document.getElementById('panelContent');

    if (currentView !== VIEWS.MAP) {
        // If coming from another view, show full map view
        switchToView(VIEWS.MAP);
        mapViewState = 'full';
        controlPanel.style.width = '420px';
        if (panelContent) {
            panelContent.style.display = 'block';
        }
    } else {
        // Toggle between expanded and shrunk states
        if (mapViewState === 'full') {
            // Shrink the panel - make it smaller
            mapViewState = 'shrunk';
            controlPanel.style.width = '80px';

            // Hide panel content, keep only header visible
            if (panelContent) {
                panelContent.style.display = 'none';
            }
        } else {
            // Expand the panel back to full size
            mapViewState = 'full';
            controlPanel.style.width = '420px';

            // Show panel content
            if (panelContent) {
                panelContent.style.display = 'block';
            }
        }
    }
}

/**
 * Switch to specified view
 */
function switchToView(view) {
    console.log('Switching to view:', view);

    currentView = view;

    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const btnView = btn.getAttribute('data-view');
        if (btnView === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Get all view containers
    const mapContainer = document.getElementById('map');
    const windCanvas = document.getElementById('windCanvas');
    const controlPanel = document.querySelector('.control-panel');
    const legend = document.querySelector('.legend');
    const analyticsView = document.getElementById('analyticsView');
    const aboutView = document.getElementById('aboutView');

    // Hide all views first
    if (mapContainer) mapContainer.style.display = 'none';
    if (windCanvas) windCanvas.style.display = 'none';
    if (controlPanel) controlPanel.style.display = 'none';
    if (legend) legend.style.display = 'none';
    if (analyticsView) analyticsView.style.display = 'none';
    if (aboutView) aboutView.style.display = 'none';

    // Show selected view with animation
    switch (view) {
        case VIEWS.MAP:
            if (mapContainer) {
                mapContainer.style.display = 'block';
                setTimeout(() => mapContainer.classList.add('active'), 10);
            }
            if (windCanvas) {
                windCanvas.style.display = 'block';
            }
            if (controlPanel) {
                controlPanel.style.display = 'block';
                controlPanel.style.width = '420px';
                controlPanel.style.transform = 'translateX(0)';

                // Show panel content
                const panelContent = document.getElementById('panelContent');
                if (panelContent) {
                    panelContent.style.display = 'block';
                }
            }
            if (legend) {
                legend.style.display = 'block';
            }
            mapViewState = 'full';
            break;

        case VIEWS.ANALYTICS:
            if (analyticsView) {
                analyticsView.style.display = 'flex';
                setTimeout(() => {
                    analyticsView.classList.add('active');
                    // Update analytics charts
                    if (typeof updateAnalytics === 'function') {
                        updateAnalytics();
                    }
                }, 10);
            }
            break;

        case VIEWS.ABOUT:
            if (aboutView) {
                aboutView.style.display = 'flex';
                setTimeout(() => aboutView.classList.add('active'), 10);
            }
            break;
    }

    // Force map resize if switching to map view
    if (view === VIEWS.MAP && map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
}

/**
 * Get current view
 */
function getCurrentView() {
    return currentView;
}

/**
 * Get current map view state
 */
function getMapViewState() {
    return mapViewState;
}
