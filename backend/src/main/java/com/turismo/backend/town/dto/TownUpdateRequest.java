package com.turismo.backend.town.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TownUpdateRequest {

    private String slug;
    private String name;
    private String description;
    private String province;
    private String country;
    private Boolean active;
}