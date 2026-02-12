// Report Generator Module

/**
 * Generate and download PDF report
 */
async function generatePDFReport(windData) {
    if (!windData) {
        throw new Error('No wind data available');
    }

    try {
        console.log('Generating PDF report for:', windData.locationName);

        // Call API to generate report
        const blob = await apiClient.generateReport(windData);

        // Create download
        downloadBlob(blob, `Turbo_Report_${windData.locationName.replace(/\s+/g, '_')}.pdf`);

        return true;
    } catch (error) {
        console.error('Error generating PDF report:', error);
        throw error;
    }
}

/**
 * Download blob as file
 */
function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Generate shareable link
 */
function generateShareableLink(windData) {
    const params = new URLSearchParams({
        lat: windData.latitude,
        lon: windData.longitude,
        location: windData.locationName
    });

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Parse URL parameters for shared links
 */
function parseSharedLink() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('lat') && params.has('lon')) {
        return {
            lat: parseFloat(params.get('lat')),
            lon: parseFloat(params.get('lon')),
            location: params.get('location') || 'Shared Location'
        };
    }

    return null;
}
