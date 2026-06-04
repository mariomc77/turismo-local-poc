package com.turismo.backend.town.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TownSummaryResponse {

    private Long id;
    private String slug;
    private String name;
    private String province;
    private String country;
    private Boolean active;
}