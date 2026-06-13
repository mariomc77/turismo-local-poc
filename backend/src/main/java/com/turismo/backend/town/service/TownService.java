package com.turismo.backend.town.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TownService {

    private static final String TOWN_NOT_FOUND_BY_SLUG = "Pueblo no encontrado: ";
    private static final String TOWN_NOT_FOUND_BY_ID = "Pueblo no encontrado con id: ";

    private final TownRepository townRepository;

    public List<TownResponse> getAllActiveTowns() {
        return townRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TownResponse getTownBySlug(String slug) {
        Town town = findActiveTownBySlug(slug);
        return mapToResponse(town);
    }

    public Town findActiveTownBySlug(String slug) {
        return townRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException(TOWN_NOT_FOUND_BY_SLUG + slug));
    }

    public Town findTownById(Long id) {
        return townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(TOWN_NOT_FOUND_BY_ID + id));
    }

    public Town findTownBySlug(String slug) {
        return townRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(TOWN_NOT_FOUND_BY_SLUG + slug));
    }

    public TownResponse mapToResponse(Town town) {
        return TownResponse.builder()
                .id(town.getId())
                .slug(town.getSlug())
                .name(town.getName())
                .description(town.getDescription())
                .province(town.getProvince())
                .country(town.getCountry())
                .active(town.getActive())
                .createdAt(town.getCreatedAt())
                .updatedAt(town.getUpdatedAt())
                .createdByEmail(town.getCreatedByEmail())
                .updatedByEmail(town.getUpdatedByEmail())
                .build();
    }
}