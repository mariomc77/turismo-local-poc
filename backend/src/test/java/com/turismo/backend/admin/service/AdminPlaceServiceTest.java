package com.turismo.backend.admin.service;

import com.turismo.backend.common.exception.BadRequestException;
import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.place.dto.PlaceCreateRequest;
import com.turismo.backend.place.dto.PlaceResponse;
import com.turismo.backend.place.dto.PlaceUpdateRequest;
import com.turismo.backend.place.entity.Place;
import com.turismo.backend.place.entity.PlaceCategory;
import com.turismo.backend.place.repository.PlaceRepository;
import com.turismo.backend.place.service.PlaceService;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.service.TownService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminPlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private TownService townService;

    @Mock
    private PlaceService placeService;

    @InjectMocks
    private AdminPlaceService adminPlaceService;

    @Test
    void getAllPlacesReturnsList() {
        Town town = town();
        Place place = place(town);

        PlaceResponse response = response();

        when(placeRepository.findAll()).thenReturn(List.of(place));
        when(placeService.mapToResponse(place)).thenReturn(response);

        List<PlaceResponse> result = adminPlaceService.getAllPlaces();

        assertEquals(1, result.size());
        assertEquals("Playa principal", result.get(0).getName());

        verify(placeRepository).findAll();
        verify(placeService).mapToResponse(place);
    }

    @Test
    void getPlaceByIdReturnsPlace() {
        Town town = town();
        Place place = place(town);
        PlaceResponse response = response();

        when(placeRepository.findById(1L)).thenReturn(Optional.of(place));
        when(placeService.mapToResponse(place)).thenReturn(response);

        PlaceResponse result = adminPlaceService.getPlaceById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Playa principal", result.getName());

        verify(placeRepository).findById(1L);
    }

    @Test
    void getPlaceByIdThrowsWhenNotFound() {
        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> adminPlaceService.getPlaceById(99L));

        verify(placeRepository).findById(99L);
    }

    @Test
    void createPlaceCreatesUsingTownId() {
        Town town = town();
        PlaceResponse response = response();

        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setTownId(1L);
        request.setName("Playa principal");
        request.setDescription("Bonita playa");
        request.setCategory(PlaceCategory.PLAYA);
        request.setAddress("Centro");
        request.setImageUrl("https://example.com/image.jpg");
        request.setLatitude(10.0);
        request.setLongitude(-85.0);
        request.setActive(true);

        when(townService.findTownById(1L)).thenReturn(town);
        when(placeRepository.save(any(Place.class))).thenAnswer(invocation -> {
            Place saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });
        when(placeService.mapToResponse(any(Place.class))).thenReturn(response);

        PlaceResponse result = adminPlaceService.createPlace(request);

        assertEquals("Playa principal", result.getName());

        verify(townService).findTownById(1L);
        verify(placeRepository).save(any(Place.class));
    }

    @Test
    void createPlaceCreatesUsingTownSlug() {
        Town town = town();
        PlaceResponse response = response();

        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setTownSlug("playas-del-coco");
        request.setName("Mirador");
        request.setCategory(PlaceCategory.MIRADOR);

        when(townService.findTownBySlug("playas-del-coco")).thenReturn(town);
        when(placeRepository.save(any(Place.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(placeService.mapToResponse(any(Place.class))).thenReturn(response);

        PlaceResponse result = adminPlaceService.createPlace(request);

        assertNotNull(result);

        verify(townService).findTownBySlug("playas-del-coco");
        verify(placeRepository).save(any(Place.class));
    }

    @Test
    void createPlaceThrowsWhenNameIsBlank() {
        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setName("");
        request.setCategory(PlaceCategory.PLAYA);
        request.setTownId(1L);

        assertThrows(BadRequestException.class,
                () -> adminPlaceService.createPlace(request));

        verify(placeRepository, never()).save(any());
    }

    @Test
    void createPlaceThrowsWhenCategoryIsNull() {
        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setName("Lugar");
        request.setTownId(1L);

        assertThrows(BadRequestException.class,
                () -> adminPlaceService.createPlace(request));

        verify(placeRepository, never()).save(any());
    }

    @Test
    void createPlaceThrowsWhenTownIsMissing() {
        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setName("Lugar");
        request.setCategory(PlaceCategory.PLAYA);

        assertThrows(BadRequestException.class,
                () -> adminPlaceService.createPlace(request));

        verify(placeRepository, never()).save(any());
    }

    @Test
    void updatePlaceUpdatesData() {
        Town town = town();
        Place existing = place(town);
        PlaceResponse response = response();

        PlaceUpdateRequest request = new PlaceUpdateRequest();
        request.setTownId(1L);
        request.setName("Nuevo lugar");
        request.setDescription("Nueva descripción");
        request.setCategory(PlaceCategory.CULTURA);
        request.setActive(true);

        when(placeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(townService.findTownById(1L)).thenReturn(town);
        when(placeRepository.save(existing)).thenReturn(existing);
        when(placeService.mapToResponse(existing)).thenReturn(response);

        PlaceResponse result = adminPlaceService.updatePlace(1L, request);

        assertNotNull(result);
        assertEquals("Nuevo lugar", existing.getName());
        assertEquals(PlaceCategory.CULTURA, existing.getCategory());

        verify(placeRepository).save(existing);
    }

    @Test
    void toggleActiveChangesStatus() {
        Town town = town();
        Place place = place(town);
        PlaceResponse response = response();

        when(placeRepository.findById(1L)).thenReturn(Optional.of(place));
        when(placeRepository.save(place)).thenReturn(place);
        when(placeService.mapToResponse(place)).thenReturn(response);

        PlaceResponse result = adminPlaceService.toggleActive(1L);

        assertNotNull(result);
        assertFalse(place.getActive());

        verify(placeRepository).save(place);
    }

    @Test
    void deletePlaceDeletesPlace() {
        Town town = town();
        Place place = place(town);

        when(placeRepository.findById(1L)).thenReturn(Optional.of(place));

        adminPlaceService.deletePlace(1L);

        verify(placeRepository).delete(place);
    }

    private Town town() {
        return Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();
    }

    private Place place(Town town) {
        return Place.builder()
                .id(1L)
                .town(town)
                .name("Playa principal")
                .description("Bonita playa")
                .category(PlaceCategory.PLAYA)
                .active(true)
                .build();
    }

    private PlaceResponse response() {
        return PlaceResponse.builder()
                .id(1L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Playa principal")
                .description("Bonita playa")
                .category(PlaceCategory.PLAYA)
                .active(true)
                .build();
    }
}