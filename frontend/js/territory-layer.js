// Territory Layer for Indian States (Leaflet Version)
let geoJsonLayer;
let hoveredStateId = null;

/**
 * Initialize territory layer
 */
async function initializeTerritoryLayer() {
    console.log('Initializing territory layer...');

    const map = getMap();
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    // Default style for states
    const defaultStyle = {
        fillColor: '#252B4A',
        fillOpacity: 0.2,
        color: '#4FC3F7',
        weight: 1.5,
        opacity: 0.6
    };

    // Hover style
    const hoverStyle = {
        fillColor: '#00BCD4',
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1
    };

    // Try to load GeoJSON data for Indian states
    try {
        // Attempt to load GeoJSON file if available
        // For now, we'll create a placeholder layer

        // Note: To add actual state boundaries, you need GeoJSON files
        // You can download India state boundaries from:
        // https://github.com/geohacker/india/tree/master/state

        console.log('Territory layer initialized (GeoJSON loading pending)');
        console.log('To add state boundaries, provide GeoJSON files in data/geojson/');

    } catch (error) {
        console.error('Error loading GeoJSON:', error);
    }
}

/**
 * Load GeoJSON for Indian states
 */
function loadStateGeoJSON(geoJsonUrl) {
    const map = getMap();
    if (!map) {
        console.error('Map not initialized');
        return;
    }

    fetch(geoJsonUrl)
        .then(response => response.json())
        .then(data => {
            // Remove existing layer if present
            if (geoJsonLayer) {
                map.removeLayer(geoJsonLayer);
            }

            // Add GeoJSON layer
            geoJsonLayer = L.geoJSON(data, {
                style: {
                    fillColor: '#252B4A',
                    fillOpacity: 0.2,
                    color: '#4FC3F7',
                    weight: 1.5,
                    opacity: 0.6
                },
                onEachFeature: (feature, layer) => {
                    // Mouse over event
                    layer.on('mouseover', function (e) {
                        const layer = e.target;
                        layer.setStyle({
                            fillColor: '#00BCD4',
                            fillOpacity: 0.4,
                            weight: 2,
                            opacity: 1
                        });

                        // Show state name
                        const stateName = feature.properties.name || feature.properties.NAME;
                        if (stateName) {
                            console.log('Hovering over:', stateName);
                        }
                    });

                    // Mouse out event
                    layer.on('mouseout', function (e) {
                        geoJsonLayer.resetStyle(e.target);
                    });

                    // Click event
                    layer.on('click', async function (e) {
                        const stateName = feature.properties.name || feature.properties.NAME;
                        const stateCode = feature.properties.code || feature.properties.CODE;

                        console.log('State clicked:', stateName);

                        if (stateName) {
                            try {
                                showLoading();
                                const territoryData = await apiClient.getTerritoryByName(stateName);

                                // Pan to state center
                                if (territoryData.centerLatitude && territoryData.centerLongitude) {
                                    panToLocation(territoryData.centerLatitude, territoryData.centerLongitude, 7);

                                    // Fetch wind data for state center
                                    const windData = await apiClient.getCurrentWindData(
                                        territoryData.centerLatitude,
                                        territoryData.centerLongitude
                                    );

                                    updateWindDataDisplay(windData);
                                }

                                hideLoading();
                                showToast(`Viewing ${stateName}`);
                            } catch (error) {
                                console.error('Error loading state data:', error);
                                hideLoading();
                                showToast('Error loading state data', 'error');
                            }
                        }
                    });
                }
            }).addTo(map);

            console.log('GeoJSON loaded successfully');
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
}

/**
 * Highlight a specific state
 */
function highlightState(stateName) {
    if (!geoJsonLayer) return;

    geoJsonLayer.eachLayer((layer) => {
        const name = layer.feature.properties.name || layer.feature.properties.NAME;
        if (name === stateName) {
            layer.setStyle({
                fillColor: '#FFD54F',
                fillOpacity: 0.5,
                weight: 2.5,
                color: '#FFA726'
            });
        }
    });
}

/**
 * Clear all state highlights
 */
function clearStateHighlights() {
    if (!geoJsonLayer) return;
    geoJsonLayer.eachLayer((layer) => {
        geoJsonLayer.resetStyle(layer);
    });
}

/**
 * Sample Indian states data (for demonstration)
 * In production, this should come from GeoJSON files
 */
const INDIAN_STATES = [
    { name: 'Tamil Nadu', code: 'TN', lat: 11.1271, lng: 78.6569 },
    { name: 'Gujarat', code: 'GJ', lat: 22.2587, lng: 71.1924 },
    { name: 'Rajasthan', code: 'RJ', lat: 27.0238, lng: 74.2179 },
    { name: 'Maharashtra', code: 'MH', lat: 19.7515, lng: 75.7139 },
    { name: 'Karnataka', code: 'KA', lat: 15.3173, lng: 75.7139 },
    { name: 'Andhra Pradesh', code: 'AP', lat: 15.9129, lng: 79.7400 },
    { name: 'Kerala', code: 'KL', lat: 10.8505, lng: 76.2711 },
    { name: 'Madhya Pradesh', code: 'MP', lat: 22.9734, lng: 78.6569 },
    { name: 'Uttar Pradesh', code: 'UP', lat: 26.8467, lng: 80.9462 },
    { name: 'West Bengal', code: 'WB', lat: 22.9868, lng: 87.8550 }
];
