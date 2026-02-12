package com.turbo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "profitability_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfitabilityScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String locationName;

    private String territoryCode;

    @Column(nullable = false)
    private Double averageWindSpeed; // in m/s

    @Column(nullable = false)
    private String grade; // A+, A, B+, B, C, D, F

    @Column(nullable = false)
    private Double score; // 0-100

    private Double estimatedEnergyYield; // kWh per year

    private Double capacityFactor; // Percentage

    private String financialViability; // Excellent, Good, Fair, Poor

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(nullable = false)
    private LocalDateTime calculatedAt;
}
