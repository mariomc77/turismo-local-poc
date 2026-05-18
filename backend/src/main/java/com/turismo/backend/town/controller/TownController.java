package com.turismo.backend.town.controller;

import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @GetMapping("/{slug}")
    public TownResponse getTownBySlug(@PathVariable String slug) {
        return townService.getTownBySlug(slug);
    }
}