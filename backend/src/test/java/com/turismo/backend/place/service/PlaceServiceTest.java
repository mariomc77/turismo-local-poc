package com.turismo.backend.place.service;

import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.entity.Place;
import com.turismo.backend.place.entity.PlaceCategory;
import com.turismo.backend.place.repository.PlaceRepository;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.service.TownService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private TownService townService;

    @InjectMocks
    private PlaceService placeService;

    @Test
    void getPlacesByTownSlug_whenPlacesExist_returnsPlaceResponses() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        Place place = Place.builder()
                .id(1L)
                .town(town)
                .name("Playa del Coco")
                .description("Playa principal de la zona")
                .category(PlaceCategory.PLAYA)
                .address("Centro de Playas del Coco")
                .imageUrl("https://example.com/playa.jpg")
                .latitude(10.5508)
                .longitude(-85.6976)
                .active(true)
                .build();

        when(townService.findActiveTownBySlug("playas-del-coco"))
                .thenReturn(town);

        when(placeRepository.findByTownAndActiveTrue(town))
                .thenReturn(List.of(place));

        List<PlaceResponse> response = placeService.getPlacesByTownSlug("playas-del-coco");

        assertThat(response).hasSize(1);
        assertThat(response.get(0).getId()).isEqualTo(1L);
        assertThat(response.get(0).getName()).isEqualTo("Playa del Coco");
        assertThat(response.get(0).getCategory()).isEqualTo(PlaceCategory.PLAYA);
        assertThat(response.get(0).getTownSlug()).isEqualTo("playas-del-coco");
        assertThat(response.get(0).getTownName()).isEqualTo("Playas del Coco");
        assertThat(response.get(0).getLatitude()).isEqualTo(10.5508);
        assertThat(response.get(0).getLongitude()).isEqualTo(-85.6976);
        assertThat(response.get(0).getActive()).isTrue();
    }

    @Test
    void getPlacesByTownSlug_whenNoPlaces_returnsEmptyList() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        when(townService.findActiveTownBySlug("playas-del-coco"))
                .thenReturn(town);

        when(placeRepository.findByTownAndActiveTrue(town))
                .thenReturn(List.of());

        List<PlaceResponse> response = placeService.getPlacesByTownSlug("playas-del-coco");

        assertThat(response).isEmpty();
    }
}