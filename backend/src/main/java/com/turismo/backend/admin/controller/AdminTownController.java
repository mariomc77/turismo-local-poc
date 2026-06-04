package com.turismo.backend.admin.controller;

import com.turismo.backend.admin.service.AdminTownService;
import com.turismo.backend.town.dto.TownCreateRequest;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.dto.TownUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/towns")
@RequiredArgsConstructor
public class AdminTownController {

    private final AdminTownService adminTownService;

    @GetMapping
    public List<TownResponse> getAllTowns() {
        return adminTownService.getAllTowns();
    }

    @GetMapping("/{id}")
    public TownResponse getTownById(@PathVariable Long id) {
        return adminTownService.getTownById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TownResponse createTown(@RequestBody TownCreateRequest request) {
        return adminTownService.createTown(request);
    }

    @PutMapping("/{id}")
    public TownResponse updateTown(
            @PathVariable Long id,
            @RequestBody TownUpdateRequest request
    ) {
        return adminTownService.updateTown(id, request);
    }

    @PatchMapping("/{id}/toggle-active")
    public TownResponse toggleActive(@PathVariable Long id) {
        return adminTownService.toggleActive(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTown(@PathVariable Long id) {
        adminTownService.deleteTown(id);
    }
}