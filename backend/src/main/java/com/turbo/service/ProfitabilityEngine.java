package com.turbo.service;

import com.turbo.model.ProfitabilityScore;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ProfitabilityEngine {

    // Wind turbine specifications (typical 2MW turbine)
    private static final double TURBINE_RATED_POWER = 2000; // kW
    private static final double CUT_IN_SPEED = 3.0; // m/s
    private static final double RATED_SPEED = 12.0; // m/s
    private static final double CUT_OUT_SPEED = 25.0; // m/s
    private static final double HOURS_PER_YEAR = 8760;

    /**
     * Calculate profitability score based on wind speed
     * 
     * @param averageWindSpeed Average wind speed in m/s
     * @param latitude         Location latitude
     * @param longitude        Location longitude
     * @param locationName     Name of the location
     * @param territoryCode    State/territory code
     * @return ProfitabilityScore object with all calculations
     */
    public ProfitabilityScore calculateProfitability(
            Double averageWindSpeed,
            Double latitude,
            Double longitude,
            String locationName,
            String territoryCode) {

        ProfitabilityScore score = new ProfitabilityScore();
        score.setLatitude(latitude);
        score.setLongitude(longitude);
        score.setLocationName(locationName);
        score.setTerritoryCode(territoryCode);
        score.setAverageWindSpeed(averageWindSpeed);
        score.setCalculatedAt(LocalDateTime.now());

        // Calculate capacity factor
        double capacityFactor = calculateCapacityFactor(averageWindSpeed);
        score.setCapacityFactor(capacityFactor);

        // Calculate estimated energy yield (kWh per year)
        double energyYield = TURBINE_RATED_POWER * HOURS_PER_YEAR * (capacityFactor / 100.0);
        score.setEstimatedEnergyYield(energyYield);

        // Calculate profitability score (0-100)
        double profitabilityScore = calculateScore(averageWindSpeed, capacityFactor);
        score.setScore(profitabilityScore);

        // Assign grade
        String grade = assignGrade(profitabilityScore);
        score.setGrade(grade);

        // Determine financial viability
        String viability = determineFinancialViability(profitabilityScore, capacityFactor);
        score.setFinancialViability(viability);

        // Generate recommendation
        String recommendation = generateRecommendation(averageWindSpeed, capacityFactor, grade);
        score.setRecommendation(recommendation);

        return score;
    }

    /**
     * Calculate capacity factor based on wind speed
     * Uses simplified power curve approximation
     */
    private double calculateCapacityFactor(double avgWindSpeed) {
        if (avgWindSpeed < CUT_IN_SPEED) {
            return 0.0;
        } else if (avgWindSpeed >= CUT_IN_SPEED && avgWindSpeed < RATED_SPEED) {
            // Linear approximation between cut-in and rated speed
            double factor = ((avgWindSpeed - CUT_IN_SPEED) / (RATED_SPEED - CUT_IN_SPEED)) * 100;
            return Math.min(factor * 0.4, 40.0); // Cap at 40% for realistic values
        } else if (avgWindSpeed >= RATED_SPEED && avgWindSpeed < CUT_OUT_SPEED) {
            // High capacity factor for optimal wind speeds
            return 35.0 + (avgWindSpeed - RATED_SPEED) * 2.0;
        } else {
            return 0.0; // Too high, turbine shuts down
        }
    }

    /**
     * Calculate overall profitability score (0-100)
     */
    private double calculateScore(double avgWindSpeed, double capacityFactor) {
        // Weight factors
        double windSpeedWeight = 0.6;
        double capacityFactorWeight = 0.4;

        // Normalize wind speed (optimal range: 6-15 m/s)
        double windSpeedScore = Math.min((avgWindSpeed / 15.0) * 100, 100);

        // Capacity factor score (optimal: >30%)
        double capacityFactorScore = Math.min((capacityFactor / 50.0) * 100, 100);

        return (windSpeedScore * windSpeedWeight) + (capacityFactorScore * capacityFactorWeight);
    }

    /**
     * Assign letter grade based on score
     */
    private String assignGrade(double score) {
        if (score >= 90)
            return "A+";
        else if (score >= 80)
            return "A";
        else if (score >= 70)
            return "B+";
        else if (score >= 60)
            return "B";
        else if (score >= 50)
            return "C";
        else if (score >= 40)
            return "D";
        else
            return "F";
    }

    /**
     * Determine financial viability category
     */
    private String determineFinancialViability(double score, double capacityFactor) {
        if (score >= 75 && capacityFactor >= 30) {
            return "Excellent";
        } else if (score >= 60 && capacityFactor >= 25) {
            return "Good";
        } else if (score >= 45 && capacityFactor >= 20) {
            return "Fair";
        } else {
            return "Poor";
        }
    }

    /**
     * Generate investment recommendation
     */
    private String generateRecommendation(double avgWindSpeed, double capacityFactor, String grade) {
        StringBuilder recommendation = new StringBuilder();

        if (grade.equals("A+") || grade.equals("A")) {
            recommendation.append("HIGHLY RECOMMENDED: This location shows exceptional wind energy potential. ");
            recommendation
                    .append(String.format("With an average wind speed of %.2f m/s and capacity factor of %.1f%%, ",
                            avgWindSpeed, capacityFactor));
            recommendation.append("this site is ideal for commercial wind farm development. ");
            recommendation.append("Expected ROI: 12-15 years with strong long-term profitability.");
        } else if (grade.equals("B+") || grade.equals("B")) {
            recommendation.append("RECOMMENDED: This location demonstrates good wind energy potential. ");
            recommendation.append(
                    String.format("Average wind speed of %.2f m/s provides viable energy generation. ", avgWindSpeed));
            recommendation.append("Suitable for medium-scale wind farm projects. ");
            recommendation.append("Expected ROI: 15-18 years with moderate profitability.");
        } else if (grade.equals("C")) {
            recommendation.append("CONDITIONAL: This location shows marginal wind energy potential. ");
            recommendation.append("Detailed feasibility study recommended before investment. ");
            recommendation.append("Consider hybrid renewable energy solutions. ");
            recommendation.append("Expected ROI: 18-22 years with lower profitability margins.");
        } else {
            recommendation.append("NOT RECOMMENDED: This location has insufficient wind energy potential. ");
            recommendation.append(String
                    .format("Average wind speed of %.2f m/s is below commercial viability threshold. ", avgWindSpeed));
            recommendation.append("Explore alternative renewable energy sources such as solar power.");
        }

        return recommendation.toString();
    }
}
