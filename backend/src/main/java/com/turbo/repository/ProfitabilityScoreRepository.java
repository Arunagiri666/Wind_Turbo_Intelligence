package com.turbo.repository;

import com.turbo.model.ProfitabilityScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfitabilityScoreRepository extends JpaRepository<ProfitabilityScore, Long> {

    List<ProfitabilityScore> findByTerritoryCode(String territoryCode);

    Optional<ProfitabilityScore> findTopByLatitudeAndLongitudeOrderByCalculatedAtDesc(
            Double latitude, Double longitude);

    List<ProfitabilityScore> findByGradeOrderByScoreDesc(String grade);
}
