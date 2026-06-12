package com.turismo.backend.place.service;

import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.entity.Place;
import com.turismo.backend.place.repository.PlaceRepository;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final TownService townService;

    public List<PlaceResponse> getPlacesByTownSlug(String slug) {
        Town town = townService.findActiveTownBySlug(slug);

        return placeRepository.findByTownAndActiveTrue(town)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PlaceResponse mapToResponse(Place place) {
        return PlaceResponse.builder()
                .id(place.getId())
                .townId(place.getTown().getId())
                .townSlug(place.getTown().getSlug())
                .townName(place.getTown().getName())
                .name(place.getName())
                .description(place.getDescription())
                .category(place.getCategory())
                .address(place.getAddress())
                .imageUrl(place.getImageUrl())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .active(place.getActive())
                .createdAt(place.getCreatedAt())
                .updatedAt(place.getUpdatedAt())
                .build();
    }
}