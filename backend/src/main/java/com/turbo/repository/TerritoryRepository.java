package com.turbo.repository;

import com.turbo.model.Territory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TerritoryRepository extends JpaRepository<Territory, Long> {
    Optional<Territory> findByName(String name);

    Optional<Territory> findByCode(String code);
}
