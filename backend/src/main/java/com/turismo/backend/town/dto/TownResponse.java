package com.turismo.backend.town.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TownResponse {

    private Long id;
    private String slug;
    private String name;
    private String description;
    private String province;
    private String country;
}