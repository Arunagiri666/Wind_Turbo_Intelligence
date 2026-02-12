package com.turbo.controller;

import com.turbo.dto.TerritoryResponse;
import com.turbo.dto.WindDataResponse;
import com.turbo.service.PDFReportService;
import com.turbo.service.WindDataService;
import com.turbo.model.Territory;
import com.turbo.repository.TerritoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/wind")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class WindDataController {

    private final WindDataService windDataService;
    private final PDFReportService pdfReportService;
    private final TerritoryRepository territoryRepository;

    /**
     * Get current wind data for specific coordinates
     */
    @GetMapping("/current")
    public ResponseEntity<WindDataResponse> getCurrentWindData(
            @RequestParam Double lat,
            @RequestParam Double lon) {

        log.info("Request received for wind data at coordinates: {}, {}", lat, lon);

        try {
            WindDataResponse windData = windDataService.getCurrentWindData(lat, lon);
            return ResponseEntity.ok(windData);
        } catch (Exception e) {
            log.error("Error fetching wind data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all territories (Indian states)
     */
    @GetMapping("/territories")
    public ResponseEntity<List<TerritoryResponse>> getAllTerritories() {
        log.info("Request received for all territories");

        try {
            List<Territory> territories = territoryRepository.findAll();
            List<TerritoryResponse> response = territories.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching territories: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get territory by name
     */
    @GetMapping("/territory/{name}")
    public ResponseEntity<TerritoryResponse> getTerritoryByName(@PathVariable String name) {
        log.info("Request received for territory: {}", name);

        try {
            Territory territory = territoryRepository.findByName(name)
                    .orElseThrow(() -> new RuntimeException("Territory not found: " + name));

            TerritoryResponse response = convertToResponse(territory);

            // Get average wind speed for this territory
            Double avgWindSpeed = windDataService.getAverageWindSpeedForTerritory(territory.getCode());
            response.setAverageWindSpeed(avgWindSpeed);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching territory: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Generate and download PDF report
     */
    @PostMapping("/report/generate")
    public ResponseEntity<byte[]> generateReport(@RequestBody WindDataResponse windData) {
        log.info("Request received to generate PDF report for: {}", windData.getLocationName());

        try {
            byte[] pdfBytes = pdfReportService.generateFeasibilityReport(windData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "Turbo_Report_" + windData.getLocationName().replaceAll(" ", "_") + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating PDF report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Turbo Wind Intelligence Portal API is running");
    }

    /**
     * Convert Territory entity to response DTO
     */
    private TerritoryResponse convertToResponse(Territory territory) {
        TerritoryResponse response = new TerritoryResponse();
        response.setId(territory.getId());
        response.setName(territory.getName());
        response.setCode(territory.getCode());
        response.setGeojson(territory.getGeojson());
        response.setArea(territory.getArea());
        response.setCenterLatitude(territory.getCenterLatitude());
        response.setCenterLongitude(territory.getCenterLongitude());
        response.setDescription(territory.getDescription());
        return response;
    }
}
