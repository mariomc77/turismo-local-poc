package com.turismo.backend.admin.controller;

import com.turismo.backend.admin.service.AdminPlaceService;
import com.turismo.backend.place.dto.PlaceCreateRequest;
import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.dto.PlaceUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/places")
@RequiredArgsConstructor
public class AdminPlaceController {

    private final AdminPlaceService adminPlaceService;

    @GetMapping
    public List<PlaceResponse> getAllPlaces() {
        return adminPlaceService.getAllPlaces();
    }

    @GetMapping("/{id}")
    public PlaceResponse getPlaceById(@PathVariable Long id) {
        return adminPlaceService.getPlaceById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaceResponse createPlace(@RequestBody PlaceCreateRequest request) {
        return adminPlaceService.createPlace(request);
    }

    @PutMapping("/{id}")
    public PlaceResponse updatePlace(
            @PathVariable Long id,
            @RequestBody PlaceUpdateRequest request
    ) {
        return adminPlaceService.updatePlace(id, request);
    }

    @PatchMapping("/{id}/toggle-active")
    public PlaceResponse toggleActive(@PathVariable Long id) {
        return adminPlaceService.toggleActive(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlace(@PathVariable Long id) {
        adminPlaceService.deletePlace(id);
    }
}