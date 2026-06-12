package com.turismo.backend.town.controller;

import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @GetMapping
    public List<TownResponse> getAllActiveTowns() {
        return townService.getAllActiveTowns();
    }

    @GetMapping("/{slug}")
    public TownResponse getTownBySlug(@PathVariable String slug) {
        return townService.getTownBySlug(slug);
    }
}