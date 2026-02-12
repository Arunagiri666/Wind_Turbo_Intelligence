package com.turbo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TerritoryResponse {
    private Long id;
    private String name;
    private String code;
    private String geojson;
    private Double area;
    private Double centerLatitude;
    private Double centerLongitude;
    private String description;
    private Double averageWindSpeed;
    private String profitabilityGrade;
}
