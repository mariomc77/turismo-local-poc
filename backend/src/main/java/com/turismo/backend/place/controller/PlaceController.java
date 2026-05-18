package com.turismo.backend.place.controller;

import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/towns/{slug}/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public List<PlaceResponse> getPlacesByTownSlug(@PathVariable String slug) {
        return placeService.getPlacesByTownSlug(slug);
    }
}