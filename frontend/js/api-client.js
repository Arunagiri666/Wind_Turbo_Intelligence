// API Client for backend communication
const API_BASE_URL = 'http://localhost:8080/api';

class APIClient {
    constructor() {
        this.cache = new Map();
        this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
    }

    /**
     * Get current wind data for coordinates
     */
    async getCurrentWindData(lat, lon) {
        const cacheKey = `wind_${lat}_${lon}`;
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            console.log('Returning cached wind data');
            return cached;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/wind/current?lat=${lat}&lon=${lon}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching wind data:', error);
            throw error;
        }
    }

    /**
     * Get all territories
     */
    async getAllTerritories() {
        const cacheKey = 'territories_all';
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            console.log('Returning cached territories');
            return cached;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/wind/territories`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching territories:', error);
            throw error;
        }
    }

    /**
     * Get territory by name
     */
    async getTerritoryByName(name) {
        try {
            const response = await fetch(`${API_BASE_URL}/wind/territory/${encodeURIComponent(name)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching territory:', error);
            throw error;
        }
    }

    /**
     * Generate PDF report
     */
    async generateReport(windData) {
        try {
            const response = await fetch(`${API_BASE_URL}/wind/report/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(windData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get the blob from response
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    }

    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export singleton instance
const apiClient = new APIClient();
