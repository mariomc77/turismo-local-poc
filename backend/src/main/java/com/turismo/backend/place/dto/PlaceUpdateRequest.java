package com.turismo.backend.place.dto;

import com.turismo.backend.place.entity.PlaceCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceUpdateRequest {

    private Long townId;
    private String townSlug;
    private String name;
    private String description;
    private PlaceCategory category;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Boolean active;
}