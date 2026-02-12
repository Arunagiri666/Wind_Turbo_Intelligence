package com.turbo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WindDataResponse {
    private Double latitude;
    private Double longitude;
    private String locationName;
    private Double windSpeed;
    private Double windDirection;
    private Double temperature;
    private Double pressure;
    private Double humidity;
    private String timestamp;

    // Profitability data
    private String grade;
    private Double score;
    private String financialViability;
    private Double estimatedEnergyYield;
    private Double capacityFactor;
    private String recommendation;
}
