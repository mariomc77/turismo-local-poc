package com.turismo.backend.place.repository;

import com.turismo.backend.place.entity.Place;
import com.turismo.backend.town.entity.Town;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByTownAndActiveTrue(Town town);

    List<Place> findByTown(Town town);
}