package com.turismo.backend.place.dto;

import com.turismo.backend.place.entity.PlaceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class PlaceResponse {

    private Long id;
    private Long townId;
    private String townSlug;
    private String townName;
    private String name;
    private String description;
    private PlaceCategory category;
    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByEmail;
    private String updatedByEmail;
}