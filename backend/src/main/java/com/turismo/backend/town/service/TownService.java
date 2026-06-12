package com.turismo.backend.town.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TownService {

    private final TownRepository townRepository;

    public TownResponse getTownBySlug(String slug) {
        Town town = townRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado: " + slug));

        return mapToResponse(town);
    }

    public Town findActiveTownBySlug(String slug) {
        return townRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado: " + slug));
    }

    public Town findTownById(Long id) {
        return townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado con id: " + id));
    }

    public Town findTownBySlug(String slug) {
        return townRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado: " + slug));
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
                .build();
    }
}