package com.turbo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.turbo.dto.WindDataResponse;
import com.turbo.model.ProfitabilityScore;
import com.turbo.model.WindData;
import com.turbo.repository.ProfitabilityScoreRepository;
import com.turbo.repository.WindDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WindDataService {

    private final RestTemplate restTemplate;
    private final WindDataRepository windDataRepository;
    private final ProfitabilityScoreRepository profitabilityScoreRepository;
    private final ProfitabilityEngine profitabilityEngine;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.url}")
    private String apiUrl;

    // Cache to reduce API calls (simple in-memory cache)
    private final Map<String, CachedWindData> cache = new HashMap<>();
    private static final long CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

    /**
     * Fetch current wind data for a location
     */
    public WindDataResponse getCurrentWindData(Double latitude, Double longitude) {
        log.info("Fetching wind data for coordinates: {}, {}", latitude, longitude);

        // Check cache first
        String cacheKey = latitude + "," + longitude;
        CachedWindData cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            log.info("Returning cached data");
            return cached.getData();
        }

        try {
            // Build API URL
            String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=metric",
                    apiUrl, latitude, longitude, apiKey);

            // Call OpenWeatherMap API
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            // Parse wind data
            WindData windData = parseWindData(root, latitude, longitude);

            // Save to database
            windDataRepository.save(windData);

            // Calculate profitability
            ProfitabilityScore profitability = profitabilityEngine.calculateProfitability(
                    windData.getWindSpeed(),
                    latitude,
                    longitude,
                    windData.getLocationName(),
                    windData.getTerritoryCode());

            // Save profitability score
            profitabilityScoreRepository.save(profitability);

            // Build response
            WindDataResponse windDataResponse = buildResponse(windData, profitability);

            // Cache the result
            cache.put(cacheKey, new CachedWindData(windDataResponse));

            return windDataResponse;

        } catch (Exception e) {
            log.error("Error fetching wind data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch wind data: " + e.getMessage());
        }
    }

    /**
     * Parse OpenWeatherMap API response
     */
    private WindData parseWindData(JsonNode root, Double latitude, Double longitude) {
        WindData windData = new WindData();

        // Location data
        windData.setLatitude(latitude);
        windData.setLongitude(longitude);
        windData.setLocationName(root.path("name").asText("Unknown"));

        // Wind data
        JsonNode wind = root.path("wind");
        windData.setWindSpeed(wind.path("speed").asDouble(0.0));
        windData.setWindDirection(wind.path("deg").asDouble(0.0));

        // Weather data
        JsonNode main = root.path("main");
        windData.setTemperature(main.path("temp").asDouble(0.0));
        windData.setPressure(main.path("pressure").asDouble(0.0));
        windData.setHumidity(main.path("humidity").asDouble(0.0));

        windData.setTimestamp(LocalDateTime.now());

        return windData;
    }

    /**
     * Build API response combining wind data and profitability
     */
    private WindDataResponse buildResponse(WindData windData, ProfitabilityScore profitability) {
        WindDataResponse response = new WindDataResponse();

        response.setLatitude(windData.getLatitude());
        response.setLongitude(windData.getLongitude());
        response.setLocationName(windData.getLocationName());
        response.setWindSpeed(windData.getWindSpeed());
        response.setWindDirection(windData.getWindDirection());
        response.setTemperature(windData.getTemperature());
        response.setPressure(windData.getPressure());
        response.setHumidity(windData.getHumidity());
        response.setTimestamp(windData.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME));

        response.setGrade(profitability.getGrade());
        response.setScore(profitability.getScore());
        response.setFinancialViability(profitability.getFinancialViability());
        response.setEstimatedEnergyYield(profitability.getEstimatedEnergyYield());
        response.setCapacityFactor(profitability.getCapacityFactor());
        response.setRecommendation(profitability.getRecommendation());

        return response;
    }

    /**
     * Get wind data for a state/territory
     */
    public Double getAverageWindSpeedForTerritory(String territoryCode) {
        return windDataRepository.findAverageWindSpeedByTerritory(territoryCode);
    }

    /**
     * Inner class for caching
     */
    private static class CachedWindData {
        private final WindDataResponse data;
        private final long timestamp;

        public CachedWindData(WindDataResponse data) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }

        public WindDataResponse getData() {
            return data;
        }

        public boolean isExpired() {
            return (System.currentTimeMillis() - timestamp) > CACHE_DURATION_MS;
        }
    }
}
