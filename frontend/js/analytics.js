// Analytics Module - Wind Data Visualization
let windSpeedChart = null;
let energyYieldChart = null;
let directionChart = null;
let analyticsData = [];

/**
 * Initialize analytics charts
 */
function initializeAnalytics() {
    console.log('Initializing analytics charts...');

    // Create charts if canvas elements exist
    const windSpeedCanvas = document.getElementById('windSpeedChart');
    const energyYieldCanvas = document.getElementById('energyYieldChart');
    const directionCanvas = document.getElementById('directionChart');

    if (windSpeedCanvas) {
        windSpeedChart = createWindSpeedChart(windSpeedCanvas);
    }

    if (energyYieldCanvas) {
        energyYieldChart = createEnergyYieldChart(energyYieldCanvas);
    }

    if (directionCanvas) {
        directionChart = createDirectionChart(directionCanvas);
    }

    console.log('Analytics charts initialized');
}

/**
 * Create wind speed trend chart
 */
function createWindSpeedChart(canvas) {
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: [],
                borderColor: '#00BCD4',
                backgroundColor: 'rgba(0, 188, 212, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#00BCD4',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#B0B8D4',
                        font: {
                            size: 14,
                            family: 'Inter'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Wind Speed Analysis',
                    color: '#FFFFFF',
                    font: {
                        size: 18,
                        family: 'Outfit',
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 58, 0.95)',
                    titleColor: '#00BCD4',
                    bodyColor: '#FFFFFF',
                    borderColor: '#00BCD4',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B8D4',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B8D4',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create energy yield chart
 */
function createEnergyYieldChart(canvas) {
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Energy Yield (kWh/yr)',
                data: [],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    '#10B981',
                    '#FBBF24',
                    '#F97316',
                    '#EF4444',
                    '#EC4899'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#B0B8D4',
                        font: {
                            size: 14,
                            family: 'Inter'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Estimated Energy Yield',
                    color: '#FFFFFF',
                    font: {
                        size: 18,
                        family: 'Outfit',
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 58, 0.95)',
                    titleColor: '#00BCD4',
                    bodyColor: '#FFFFFF',
                    borderColor: '#00BCD4',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B8D4',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#B0B8D4',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create wind direction distribution chart
 */
function createDirectionChart(canvas) {
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
            datasets: [{
                label: 'Wind Direction Frequency',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(6, 182, 212, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(251, 191, 36, 0.7)',
                    'rgba(249, 115, 22, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(147, 51, 234, 0.7)',
                    'rgba(59, 130, 246, 0.7)'
                ],
                borderColor: '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: '#B0B8D4',
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Wind Direction Distribution',
                    color: '#FFFFFF',
                    font: {
                        size: 18,
                        family: 'Outfit',
                        weight: 'bold'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 31, 58, 0.95)',
                    titleColor: '#00BCD4',
                    bodyColor: '#FFFFFF',
                    borderColor: '#00BCD4',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                r: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#B0B8D4',
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    });
}

/**
 * Add wind data point to analytics
 */
function addAnalyticsDataPoint(windData) {
    const timestamp = new Date().toLocaleTimeString();

    analyticsData.push({
        timestamp: timestamp,
        speed: windData.speed,
        direction: windData.direction,
        energyYield: windData.energyYield || 0,
        location: windData.locationName || 'Unknown'
    });

    // Keep only last 10 data points
    if (analyticsData.length > 10) {
        analyticsData.shift();
    }

    console.log('Analytics data updated:', analyticsData.length, 'points');
}

/**
 * Update all analytics charts
 */
function updateAnalytics() {
    if (analyticsData.length === 0) {
        // Show sample data if no real data
        showSampleData();
        return;
    }

    // Update wind speed chart
    if (windSpeedChart) {
        windSpeedChart.data.labels = analyticsData.map(d => d.timestamp);
        windSpeedChart.data.datasets[0].data = analyticsData.map(d => d.speed);
        windSpeedChart.update();
    }

    // Update energy yield chart
    if (energyYieldChart) {
        energyYieldChart.data.labels = analyticsData.map(d => d.location);
        energyYieldChart.data.datasets[0].data = analyticsData.map(d => d.energyYield);
        energyYieldChart.update();
    }

    // Update direction distribution
    if (directionChart && analyticsData.length > 0) {
        const directionCounts = [0, 0, 0, 0, 0, 0, 0, 0];
        analyticsData.forEach(d => {
            const dir = d.direction;
            const index = Math.floor(((dir + 22.5) % 360) / 45);
            directionCounts[index]++;
        });
        directionChart.data.datasets[0].data = directionCounts;
        directionChart.update();
    }

    // Update statistics
    updateStatistics();
}

/**
 * Show sample data for demonstration
 */
function showSampleData() {
    const sampleData = [
        { timestamp: '10:00', speed: 5.2, direction: 45, energyYield: 12500, location: 'Mumbai' },
        { timestamp: '11:00', speed: 6.8, direction: 90, energyYield: 15200, location: 'Delhi' },
        { timestamp: '12:00', speed: 8.5, direction: 135, energyYield: 18900, location: 'Chennai' },
        { timestamp: '13:00', speed: 7.2, direction: 180, energyYield: 16100, location: 'Bangalore' },
        { timestamp: '14:00', speed: 9.1, direction: 225, energyYield: 20400, location: 'Hyderabad' }
    ];

    if (windSpeedChart) {
        windSpeedChart.data.labels = sampleData.map(d => d.timestamp);
        windSpeedChart.data.datasets[0].data = sampleData.map(d => d.speed);
        windSpeedChart.update();
    }

    if (energyYieldChart) {
        energyYieldChart.data.labels = sampleData.map(d => d.location);
        energyYieldChart.data.datasets[0].data = sampleData.map(d => d.energyYield);
        energyYieldChart.update();
    }

    if (directionChart) {
        directionChart.data.datasets[0].data = [2, 1, 3, 2, 1, 2, 1, 3];
        directionChart.update();
    }
}

/**
 * Update statistics display
 */
function updateStatistics() {
    if (analyticsData.length === 0) return;

    const avgSpeed = (analyticsData.reduce((sum, d) => sum + d.speed, 0) / analyticsData.length).toFixed(2);
    const maxSpeed = Math.max(...analyticsData.map(d => d.speed)).toFixed(2);
    const avgEnergy = (analyticsData.reduce((sum, d) => sum + d.energyYield, 0) / analyticsData.length).toFixed(0);

    document.getElementById('avgWindSpeed').textContent = `${avgSpeed} m/s`;
    document.getElementById('maxWindSpeed').textContent = `${maxSpeed} m/s`;
    document.getElementById('avgEnergyYield').textContent = `${avgEnergy} kWh/yr`;
    document.getElementById('totalLocations').textContent = analyticsData.length;
}
