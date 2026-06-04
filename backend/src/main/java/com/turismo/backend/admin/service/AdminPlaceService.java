package com.turismo.backend.admin.service;

import com.turismo.backend.common.exception.BadRequestException;
import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.place.dto.PlaceCreateRequest;
import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.dto.PlaceUpdateRequest;
import com.turismo.backend.place.entity.Place;
import com.turismo.backend.place.repository.PlaceRepository;
import com.turismo.backend.place.service.PlaceService;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPlaceService {

    private final PlaceRepository placeRepository;
    private final TownService townService;
    private final PlaceService placeService;

    public List<PlaceResponse> getAllPlaces() {
        return placeRepository.findAll()
                .stream()
                .map(placeService::mapToResponse)
                .toList();
    }

    public PlaceResponse getPlaceById(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar no encontrado con id: " + id));

        return placeService.mapToResponse(place);
    }

    public PlaceResponse createPlace(PlaceCreateRequest request) {
        validatePlaceRequest(request);

        Town town = resolveTown(request.getTownId(), request.getTownSlug());

        Place place = Place.builder()
                .town(town)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .address(request.getAddress())
                .imageUrl(request.getImageUrl())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .active(request.getActive() == null || request.getActive())
                .build();

        return placeService.mapToResponse(placeRepository.save(place));
    }

    public PlaceResponse updatePlace(Long id, PlaceUpdateRequest request) {
        validatePlaceRequest(request);

        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar no encontrado con id: " + id));

        Town town = resolveTown(request.getTownId(), request.getTownSlug());

        place.setTown(town);
        place.setName(request.getName());
        place.setDescription(request.getDescription());
        place.setCategory(request.getCategory());
        place.setAddress(request.getAddress());
        place.setImageUrl(request.getImageUrl());
        place.setLatitude(request.getLatitude());
        place.setLongitude(request.getLongitude());
        place.setActive(request.getActive() == null || request.getActive());

        return placeService.mapToResponse(placeRepository.save(place));
    }

    public PlaceResponse toggleActive(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar no encontrado con id: " + id));

        place.setActive(!place.getActive());

        return placeService.mapToResponse(placeRepository.save(place));
    }

    public void deletePlace(Long id) {
        Place place = placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lugar no encontrado con id: " + id));

        placeRepository.delete(place);
    }

    private Town resolveTown(Long townId, String townSlug) {
        if (townId != null) {
            return townService.findTownById(townId);
        }

        if (townSlug != null && !townSlug.isBlank()) {
            return townService.findTownBySlug(townSlug);
        }

        throw new BadRequestException("Debe indicar townId o townSlug");
    }

    private void validatePlaceRequest(PlaceCreateRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("El nombre del lugar es obligatorio");
        }

        if (request.getCategory() == null) {
            throw new BadRequestException("La categoría del lugar es obligatoria");
        }
    }

    private void validatePlaceRequest(PlaceUpdateRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("El nombre del lugar es obligatorio");
        }

        if (request.getCategory() == null) {
            throw new BadRequestException("La categoría del lugar es obligatoria");
        }
    }
}