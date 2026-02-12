package com.turbo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wind_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WindData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double windSpeed; // in m/s

    @Column(nullable = false)
    private Double windDirection; // in degrees

    private Double temperature; // in Celsius

    private Double pressure; // in hPa

    private Double humidity; // in percentage

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String locationName;

    private String territoryCode; // Reference to state
}
