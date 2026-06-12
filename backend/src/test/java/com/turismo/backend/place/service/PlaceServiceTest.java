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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private TownService townService;

    @InjectMocks
    private PlaceService placeService;

    @Test
    void getPlacesByTownSlugReturnsActivePlaces() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        Place place = Place.builder()
                .id(1L)
                .town(town)
                .name("Playa principal")
                .description("Lugar turístico")
                .category(PlaceCategory.PLAYA)
                .address("Centro")
                .imageUrl("https://example.com/playa.jpg")
                .latitude(10.123)
                .longitude(-85.123)
                .active(true)
                .build();

        when(townService.findActiveTownBySlug("playas-del-coco")).thenReturn(town);
        when(placeRepository.findByTownAndActiveTrue(town)).thenReturn(List.of(place));

        List<PlaceResponse> result = placeService.getPlacesByTownSlug("playas-del-coco");

        assertEquals(1, result.size());
        assertEquals("Playa principal", result.get(0).getName());
        assertEquals(PlaceCategory.PLAYA, result.get(0).getCategory());
        assertEquals("playas-del-coco", result.get(0).getTownSlug());

        verify(townService).findActiveTownBySlug("playas-del-coco");
        verify(placeRepository).findByTownAndActiveTrue(town);
    }

    @Test
    void getPlacesByTownSlugReturnsEmptyListWhenNoPlaces() {
        Town town = Town.builder()
                .id(1L)
                .slug("samara")
                .name("Sámara")
                .active(true)
                .build();

        when(townService.findActiveTownBySlug("samara")).thenReturn(town);
        when(placeRepository.findByTownAndActiveTrue(town)).thenReturn(List.of());

        List<PlaceResponse> result = placeService.getPlacesByTownSlug("samara");

        assertTrue(result.isEmpty());

        verify(townService).findActiveTownBySlug("samara");
        verify(placeRepository).findByTownAndActiveTrue(town);
    }

    @Test
    void mapToResponseMapsAllFields() {
        Town town = Town.builder()
                .id(5L)
                .slug("tamarindo")
                .name("Tamarindo")
                .active(true)
                .build();

        Place place = Place.builder()
                .id(8L)
                .town(town)
                .name("Mirador Tamarindo")
                .description("Vista al mar")
                .category(PlaceCategory.MIRADOR)
                .address("Ruta principal")
                .imageUrl("https://example.com/mirador.jpg")
                .latitude(10.299)
                .longitude(-85.840)
                .active(true)
                .build();

        PlaceResponse response = placeService.mapToResponse(place);

        assertEquals(8L, response.getId());
        assertEquals(5L, response.getTownId());
        assertEquals("tamarindo", response.getTownSlug());
        assertEquals("Tamarindo", response.getTownName());
        assertEquals("Mirador Tamarindo", response.getName());
        assertEquals(PlaceCategory.MIRADOR, response.getCategory());
        assertTrue(response.getActive());
    }
}