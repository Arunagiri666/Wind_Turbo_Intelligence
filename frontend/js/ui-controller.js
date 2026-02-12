// UI Controller for user interactions
let currentWindData = null;

/**
 * Update wind data display in UI
 */
function updateWindDataDisplay(windData) {
    currentWindData = windData;

    // Update location info
    document.getElementById('locationName').textContent = windData.locationName || 'Unknown Location';
    document.getElementById('coordinates').textContent =
        `${windData.latitude.toFixed(4)}°N, ${windData.longitude.toFixed(4)}°E`;

    // Update grade display
    const gradeLetter = document.getElementById('gradeLetter');
    gradeLetter.textContent = windData.grade || '--';

    // Update grade circle color based on grade
    const gradeCircle = document.querySelector('.grade-circle');
    gradeCircle.style.background = getGradeGradient(windData.grade);

    // Update score and viability
    document.getElementById('scoreValue').textContent =
        windData.score ? `${windData.score.toFixed(1)}/100` : '--';
    document.getElementById('viabilityValue').textContent =
        windData.financialViability || '--';

    // Update wind data with Beaufort scale
    const beaufortScale = getBeaufortScale(windData.windSpeed);
    document.getElementById('windSpeed').textContent =
        windData.windSpeed ? `${windData.windSpeed.toFixed(2)} m/s` : '-- m/s';

    // Add Beaufort scale as subtitle if element exists
    const windSpeedLabel = document.querySelector('#windSpeed').parentElement.querySelector('.data-label');
    if (windSpeedLabel && windData.windSpeed) {
        windSpeedLabel.innerHTML = `Wind Speed <span style="font-size: 0.65rem; opacity: 0.7;">(${beaufortScale})</span>`;
    }

    document.getElementById('windDirection').textContent =
        windData.windDirection ? `${windData.windDirection.toFixed(0)}° ${getWindDirectionName(windData.windDirection)}` : '--°';
    document.getElementById('energyYield').textContent =
        windData.estimatedEnergyYield ?
            `${(windData.estimatedEnergyYield / 1000).toFixed(0)}k kWh/yr` : '-- kWh/yr';
    document.getElementById('capacityFactor').textContent =
        windData.capacityFactor ? `${windData.capacityFactor.toFixed(1)}%` : '--%';

    // Update recommendation
    document.getElementById('recommendationText').textContent =
        windData.recommendation || 'No recommendation available';

    // Enable download button
    document.getElementById('downloadReport').disabled = false;

    // Update wind visualization
    if (windData.windSpeed && windData.windDirection) {
        updateWindField(windData.windSpeed, windData.windDirection);
    }

    // Add to analytics data
    if (typeof addAnalyticsDataPoint === 'function') {
        addAnalyticsDataPoint({
            speed: windData.windSpeed,
            direction: windData.windDirection,
            energyYield: windData.estimatedEnergyYield || 0,
            locationName: windData.locationName || 'Unknown'
        });
    }
}

/**
 * Get gradient based on grade
 */
function getGradeGradient(grade) {
    const gradients = {
        'A+': 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
        'A': 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
        'B+': 'linear-gradient(135deg, #00BCD4 0%, #26C6DA 100%)',
        'B': 'linear-gradient(135deg, #26C6DA 0%, #4DD0E1 100%)',
        'C': 'linear-gradient(135deg, #FFD54F 0%, #FFE082 100%)',
        'D': 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
        'F': 'linear-gradient(135deg, #EF5350 0%, #E57373 100%)'
    };

    return gradients[grade] || 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)';
}

/**
 * Get Beaufort scale classification
 */
function getBeaufortScale(windSpeed) {
    if (windSpeed < 0.5) return 'Calm';
    if (windSpeed < 1.5) return 'Light Air';
    if (windSpeed < 3.3) return 'Light Breeze';
    if (windSpeed < 5.5) return 'Gentle Breeze';
    if (windSpeed < 8.0) return 'Moderate Breeze';
    if (windSpeed < 10.8) return 'Fresh Breeze';
    if (windSpeed < 13.9) return 'Strong Breeze';
    if (windSpeed < 17.2) return 'Near Gale';
    if (windSpeed < 20.8) return 'Gale';
    if (windSpeed < 24.5) return 'Strong Gale';
    if (windSpeed < 28.5) return 'Storm';
    if (windSpeed < 32.7) return 'Violent Storm';
    return 'Hurricane';
}

/**
 * Get wind direction name
 */
function getWindDirectionName(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees % 360) / 22.5));
    return directions[index % 16];
}

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Initialize UI event listeners
 */
function initializeUIListeners() {
    // Search button
    document.getElementById('searchBtn').addEventListener('click', handleSearch);

    // Search input (Enter key)
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Download report button
    document.getElementById('downloadReport').addEventListener('click', handleDownloadReport);

    // Share button
    document.getElementById('shareBtn').addEventListener('click', handleShare);

    // Panel toggle
    document.getElementById('panelToggle').addEventListener('click', togglePanel);

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

/**
 * Handle search
 */
async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) {
        showToast('Please enter a city or location name', 'error');
        return;
    }

    try {
        showLoading();

        // Use Google Geocoding API to search for any location
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: query }, async (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();
                const locationName = results[0].formatted_address;

                // Pan to location
                panToLocation(lat, lng, 10);

                // Fetch wind data
                const windData = await apiClient.getCurrentWindData(lat, lng);
                updateWindDataDisplay(windData);
                addMarker(lat, lng, locationName);

                showToast(`Viewing ${locationName}`);
                hideLoading();
            } else {
                // Fallback: Try to find in Indian states
                const state = INDIAN_STATES.find(s =>
                    s.name.toLowerCase().includes(query.toLowerCase())
                );

                if (state) {
                    panToLocation(state.lat, state.lng, 7);
                    const windData = await apiClient.getCurrentWindData(state.lat, state.lng);
                    updateWindDataDisplay(windData);
                    addMarker(state.lat, state.lng, state.name);
                    showToast(`Viewing ${state.name}`);
                } else {
                    showToast('Location not found. Please try a different search term.', 'error');
                }
                hideLoading();
            }
        });

    } catch (error) {
        console.error('Search error:', error);
        hideLoading();
        showToast('Error searching location', 'error');
    }
}

/**
 * Handle download report
 */
async function handleDownloadReport() {
    if (!currentWindData) {
        showToast('No data available to generate report', 'error');
        return;
    }

    try {
        showLoading();

        const blob = await apiClient.generateReport(currentWindData);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Turbo_Report_${currentWindData.locationName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        hideLoading();
        showToast('Report downloaded successfully!');
    } catch (error) {
        console.error('Download error:', error);
        hideLoading();
        showToast('Error downloading report', 'error');
    }
}

/**
 * Handle share
 */
function handleShare() {
    if (!currentWindData) {
        showToast('No data available to share', 'error');
        return;
    }

    const shareData = {
        title: 'Turbo Wind Analysis',
        text: `Wind analysis for ${currentWindData.locationName}: Grade ${currentWindData.grade}, ${currentWindData.windSpeed.toFixed(2)} m/s`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('Shared successfully!'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        const text = `${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(text)
            .then(() => showToast('Link copied to clipboard!'))
            .catch(() => showToast('Could not copy to clipboard', 'error'));
    }
}

/**
 * Toggle panel
 */
function togglePanel() {
    const panelContent = document.getElementById('panelContent');
    const panelToggle = document.getElementById('panelToggle');

    if (panelContent.style.display === 'none') {
        panelContent.style.display = 'block';
        panelToggle.style.transform = 'rotate(0deg)';
    } else {
        panelContent.style.display = 'none';
        panelToggle.style.transform = 'rotate(180deg)';
    }
}
