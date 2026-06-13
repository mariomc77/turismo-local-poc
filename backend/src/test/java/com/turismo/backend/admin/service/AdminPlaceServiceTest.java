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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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

    private Town town;
    private Place place;
    private PlaceResponse placeResponse;

    @BeforeEach
    void setUp() {
        town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        place = Place.builder()
                .id(10L)
                .town(town)
                .name("Playa del Coco")
                .description("Playa principal")
                .category(PlaceCategory.PLAYA)
                .address("Centro")
                .imageUrl("image.jpg")
                .latitude(10.55)
                .longitude(-85.69)
                .active(true)
                .build();

        placeResponse = PlaceResponse.builder()
                .id(10L)
                .townId(1L)
                .townSlug("playas-del-coco")
                .townName("Playas del Coco")
                .name("Playa del Coco")
                .description("Playa principal")
                .category(PlaceCategory.PLAYA)
                .address("Centro")
                .imageUrl("image.jpg")
                .latitude(10.55)
                .longitude(-85.69)
                .active(true)
                .build();
    }

    @Test
    void getAllPlacesReturnsMappedPlaces() {
        when(placeRepository.findAll()).thenReturn(List.of(place));
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        List<PlaceResponse> result = adminPlaceService.getAllPlaces();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isSameAs(placeResponse);
        verify(placeRepository).findAll();
        verify(placeService).mapToResponse(place);
    }

    @Test
    void getPlaceByIdReturnsMappedPlace() {
        when(placeRepository.findById(10L)).thenReturn(Optional.of(place));
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        PlaceResponse result = adminPlaceService.getPlaceById(10L);

        assertThat(result).isSameAs(placeResponse);
        verify(placeRepository).findById(10L);
        verify(placeService).mapToResponse(place);
    }

    @Test
    void getPlaceByIdThrowsWhenPlaceDoesNotExist() {
        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminPlaceService.getPlaceById(99L));

        verify(placeRepository).findById(99L);
    }

    @Test
    void createPlaceWithTownIdCreatesPlace() {
        PlaceCreateRequest request = validCreateRequest();
        request.setTownId(1L);
        request.setTownSlug(null);

        when(townService.findTownById(1L)).thenReturn(town);
        when(placeRepository.save(any(Place.class))).thenReturn(place);
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        PlaceResponse result = adminPlaceService.createPlace(request);

        assertThat(result).isSameAs(placeResponse);
        verify(townService).findTownById(1L);
        verify(placeRepository).save(any(Place.class));
        verify(placeService).mapToResponse(place);
    }

    @Test
    void createPlaceWithTownSlugCreatesPlace() {
        PlaceCreateRequest request = validCreateRequest();
        request.setTownId(null);
        request.setTownSlug("playas-del-coco");

        when(townService.findTownBySlug("playas-del-coco")).thenReturn(town);
        when(placeRepository.save(any(Place.class))).thenReturn(place);
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        PlaceResponse result = adminPlaceService.createPlace(request);

        assertThat(result).isSameAs(placeResponse);
        verify(townService).findTownBySlug("playas-del-coco");
        verify(placeRepository).save(any(Place.class));
    }

    @Test
    void createPlaceThrowsWhenNameIsBlank() {
        PlaceCreateRequest request = validCreateRequest();
        request.setName(" ");

        assertThrows(BadRequestException.class, () -> adminPlaceService.createPlace(request));
    }

    @Test
    void createPlaceThrowsWhenCategoryIsNull() {
        PlaceCreateRequest request = validCreateRequest();
        request.setCategory(null);

        assertThrows(BadRequestException.class, () -> adminPlaceService.createPlace(request));
    }

    @Test
    void createPlaceThrowsWhenTownIsMissing() {
        PlaceCreateRequest request = validCreateRequest();
        request.setTownId(null);
        request.setTownSlug(null);

        assertThrows(BadRequestException.class, () -> adminPlaceService.createPlace(request));
    }

    @Test
    void updatePlaceUpdatesExistingPlace() {
        PlaceUpdateRequest request = validUpdateRequest();

        when(placeRepository.findById(10L)).thenReturn(Optional.of(place));
        when(townService.findTownById(1L)).thenReturn(town);
        when(placeRepository.save(place)).thenReturn(place);
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        PlaceResponse result = adminPlaceService.updatePlace(10L, request);

        assertThat(result).isSameAs(placeResponse);
        assertThat(place.getName()).isEqualTo("Playa actualizada");
        verify(placeRepository).findById(10L);
        verify(placeRepository).save(place);
    }

    @Test
    void updatePlaceThrowsWhenPlaceDoesNotExist() {
        PlaceUpdateRequest request = validUpdateRequest();

        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminPlaceService.updatePlace(99L, request));

        verify(placeRepository).findById(99L);
    }

    @Test
    void toggleActiveChangesPlaceStatus() {
        when(placeRepository.findById(10L)).thenReturn(Optional.of(place));
        when(placeRepository.save(place)).thenReturn(place);
        when(placeService.mapToResponse(place)).thenReturn(placeResponse);

        PlaceResponse result = adminPlaceService.toggleActive(10L);

        assertThat(result).isSameAs(placeResponse);
        assertThat(place.getActive()).isFalse();
        verify(placeRepository).save(place);
    }

    @Test
    void toggleActiveThrowsWhenPlaceDoesNotExist() {
        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminPlaceService.toggleActive(99L));

        verify(placeRepository).findById(99L);
    }

    @Test
    void deletePlaceDeletesExistingPlace() {
        when(placeRepository.findById(10L)).thenReturn(Optional.of(place));

        adminPlaceService.deletePlace(10L);

        verify(placeRepository).findById(10L);
        verify(placeRepository).delete(place);
    }

    @Test
    void deletePlaceThrowsWhenPlaceDoesNotExist() {
        when(placeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminPlaceService.deletePlace(99L));

        verify(placeRepository).findById(99L);
    }

    private PlaceCreateRequest validCreateRequest() {
        PlaceCreateRequest request = new PlaceCreateRequest();
        request.setTownId(1L);
        request.setName("Playa del Coco");
        request.setDescription("Playa principal");
        request.setCategory(PlaceCategory.PLAYA);
        request.setAddress("Centro");
        request.setImageUrl("image.jpg");
        request.setLatitude(10.55);
        request.setLongitude(-85.69);
        request.setActive(true);
        return request;
    }

    private PlaceUpdateRequest validUpdateRequest() {
        PlaceUpdateRequest request = new PlaceUpdateRequest();
        request.setTownId(1L);
        request.setName("Playa actualizada");
        request.setDescription("Descripción actualizada");
        request.setCategory(PlaceCategory.PLAYA);
        request.setAddress("Centro actualizado");
        request.setImageUrl("updated.jpg");
        request.setLatitude(10.56);
        request.setLongitude(-85.70);
        request.setActive(true);
        return request;
    }
}