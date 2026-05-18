package com.turismo.backend.town.repository;

import com.turismo.backend.town.entity.Town;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TownRepository extends JpaRepository<Town, Long> {

    Optional<Town> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);
}