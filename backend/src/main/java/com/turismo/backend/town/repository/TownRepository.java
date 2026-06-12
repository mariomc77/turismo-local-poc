package com.turismo.backend.town.repository;

import com.turismo.backend.town.entity.Town;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TownRepository extends JpaRepository<Town, Long> {

    Optional<Town> findBySlugAndActiveTrue(String slug);

    Optional<Town> findBySlug(String slug);

    List<Town> findByActiveTrueOrderByNameAsc();

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}