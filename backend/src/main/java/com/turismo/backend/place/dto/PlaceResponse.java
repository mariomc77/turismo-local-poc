package com.turismo.backend.place.dto;

import com.turismo.backend.place.entity.PlaceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PlaceResponse {

    private Long id;
    private String name;
    private String description;
    private PlaceCategory category;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
}