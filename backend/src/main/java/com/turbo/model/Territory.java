package com.turbo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "territories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Territory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String code; // State code (e.g., "TN" for Tamil Nadu)

    @Column(columnDefinition = "TEXT")
    private String geojson; // GeoJSON boundary data

    private Double area; // Area in square kilometers

    private Double centerLatitude;

    private Double centerLongitude;

    @Column(columnDefinition = "TEXT")
    private String description;
}
