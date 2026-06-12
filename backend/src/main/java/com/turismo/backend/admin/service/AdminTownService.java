package com.turismo.backend.admin.service;

import com.turismo.backend.common.exception.BadRequestException;
import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownCreateRequest;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.dto.TownUpdateRequest;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import com.turismo.backend.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminTownService {

    private final TownRepository townRepository;
    private final TownService townService;

    public List<TownResponse> getAllTowns() {
        return townRepository.findAll()
                .stream()
                .map(townService::mapToResponse)
                .toList();
    }

    public TownResponse getTownById(Long id) {
        Town town = townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado con id: " + id));

        return townService.mapToResponse(town);
    }

    public TownResponse createTown(TownCreateRequest request) {
        validateTownRequest(request.getName());

        String slug = resolveSlug(request.getSlug(), request.getName());

        if (townRepository.existsBySlug(slug)) {
            throw new BadRequestException("Ya existe un pueblo con el slug: " + slug);
        }

        Town town = Town.builder()
                .slug(slug)
                .name(request.getName().trim())
                .description(request.getDescription())
                .province(request.getProvince())
                .country(request.getCountry() == null || request.getCountry().isBlank() ? "Costa Rica" : request.getCountry())
                .active(request.getActive() == null || request.getActive())
                .build();

        return townService.mapToResponse(townRepository.save(town));
    }

    public TownResponse updateTown(Long id, TownUpdateRequest request) {
        Town town = townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado con id: " + id));

        validateTownRequest(request.getName());

        String slug = resolveSlug(request.getSlug(), request.getName());

        if (townRepository.existsBySlugAndIdNot(slug, id)) {
            throw new BadRequestException("Ya existe otro pueblo con el slug: " + slug);
        }

        town.setSlug(slug);
        town.setName(request.getName().trim());
        town.setDescription(request.getDescription());
        town.setProvince(request.getProvince());
        town.setCountry(request.getCountry() == null || request.getCountry().isBlank() ? "Costa Rica" : request.getCountry());
        town.setActive(request.getActive() == null || request.getActive());

        return townService.mapToResponse(townRepository.save(town));
    }

    public TownResponse toggleActive(Long id) {
        Town town = townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado con id: " + id));

        town.setActive(!Boolean.TRUE.equals(town.getActive()));

        return townService.mapToResponse(townRepository.save(town));
    }

    public void deleteTown(Long id) {
        Town town = townRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado con id: " + id));

        townRepository.delete(town);
    }

    private void validateTownRequest(String name) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("El nombre del pueblo es obligatorio");
        }
    }

    private String resolveSlug(String slug, String name) {
        if (slug != null && !slug.isBlank()) {
            return cleanSlug(slug);
        }

        return cleanSlug(name);
    }

    private String cleanSlug(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        return normalized
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}