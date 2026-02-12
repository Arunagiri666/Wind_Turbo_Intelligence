package com.turbo.repository;

import com.turbo.model.WindData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WindDataRepository extends JpaRepository<WindData, Long> {

    List<WindData> findByTerritoryCode(String territoryCode);

    List<WindData> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT AVG(w.windSpeed) FROM WindData w WHERE w.territoryCode = :code")
    Double findAverageWindSpeedByTerritory(@Param("code") String code);

    @Query("SELECT w FROM WindData w WHERE w.latitude BETWEEN :minLat AND :maxLat " +
            "AND w.longitude BETWEEN :minLon AND :maxLon " +
            "ORDER BY w.timestamp DESC")
    List<WindData> findByLocationRange(@Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon);
}
