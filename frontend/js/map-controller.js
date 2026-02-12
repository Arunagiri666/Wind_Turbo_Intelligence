// Leaflet Map Controller (Migrated from Google Maps)
let map;
let currentMarker;

const MAP_CONFIG = {
    center: [20.5937, 78.9629], // Center of India [lat, lng]
    zoom: 5,
    minZoom: 4,
    maxZoom: 18
};

/**
 * Initialize Leaflet Map
 */
function initializeMap() {
    console.log('Initializing Leaflet Map...');

    // Create map instance
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true // Better performance
    });

    // Use OpenStreetMap Standard - GUARANTEED VISIBLE!
    // This is the most reliable and clear tile provider
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Alternative Map Themes (uncomment one to try different styles):

    // Option 1: CartoDB Voyager (Colorful, clear)
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    //     attribution: '&copy; OpenStreetMap &copy; CARTO',
    //     subdomains: 'abcd',
    //     maxZoom: 20
    // }).addTo(map);

    // Option 2: CartoDB Positron (Clean, minimal, light)
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //     attribution: '&copy; OpenStreetMap &copy; CARTO',
    //     subdomains: 'abcd',
    //     maxZoom: 20
    // }).addTo(map);

    // Option 3: Esri WorldStreetMap (Detailed, colorful)
    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    //     attribution: 'Tiles &copy; Esri',
    //     maxZoom: 18
    // }).addTo(map);

    // Option 4: Satellite View
    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    //     attribution: 'Tiles &copy; Esri',
    //     maxZoom: 18
    // }).addTo(map);

    // Add click listener for map
    map.on('click', async (event) => {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        console.log('Map clicked at:', lat, lon);
        await handleMapClick(lat, lon);
    });

    console.log('Leaflet Map initialized successfully!');
}

/**
 * Handle map click event
 */
async function handleMapClick(lat, lon) {
    try {
        // Show loading
        showLoading();

        // Remove previous marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Add new marker with custom icon
        currentMarker = L.circleMarker([lat, lon], {
            radius: 10,
            fillColor: '#00BCD4',
            color: '#FFFFFF',
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map);

        // Add bounce animation effect
        currentMarker.bindPopup(`<b>Analyzing Location</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lon.toFixed(4)}`);

        // Fetch wind data
        const windData = await apiClient.getCurrentWindData(lat, lon);

        // Update UI
        updateWindDataDisplay(windData);

        // Hide loading
        hideLoading();

        // Show success toast
        showToast('Wind data loaded successfully!');

    } catch (error) {
        console.error('Error handling map click:', error);
        hideLoading();
        showToast('Error loading wind data. Please try again.', 'error');
    }
}

/**
 * Pan map to location
 */
function panToLocation(lat, lon, zoom = 10) {
    map.setView([lat, lon], zoom, {
        animate: true,
        duration: 1.0
    });
}

/**
 * Add marker to map
 */
function addMarker(lat, lon, title = '') {
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    currentMarker = L.circleMarker([lat, lon], {
        radius: 10,
        fillColor: '#00BCD4',
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(map);

    if (title) {
        currentMarker.bindPopup(`<b>${title}</b>`).openPopup();
    }
}

/**
 * Get map instance
 */
function getMap() {
    return map;
}
