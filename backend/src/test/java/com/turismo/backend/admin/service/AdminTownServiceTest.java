package com.turismo.backend.admin.service;

import com.turismo.backend.common.exception.BadRequestException;
import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownCreateRequest;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.dto.TownUpdateRequest;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import com.turismo.backend.town.service.TownService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminTownServiceTest {

    @Mock
    private TownRepository townRepository;

    @Mock
    private TownService townService;

    @InjectMocks
    private AdminTownService adminTownService;

    private Town town;
    private TownResponse townResponse;

    @BeforeEach
    void setUp() {
        town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .description("Destino turístico costero")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(2))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build();

        townResponse = TownResponse.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .description("Destino turístico costero")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .createdAt(town.getCreatedAt())
                .updatedAt(town.getUpdatedAt())
                .build();
    }

    @Test
    void getAllTownsReturnsMappedTowns() {
        when(townRepository.findAll()).thenReturn(List.of(town));
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        List<TownResponse> result = adminTownService.getAllTowns();

        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isSameAs(townResponse);
        verify(townRepository).findAll();
        verify(townService).mapToResponse(town);
    }

    @Test
    void getTownByIdReturnsMappedTown() {
        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        TownResponse result = adminTownService.getTownById(1L);

        assertThat(result).isSameAs(townResponse);
        verify(townRepository).findById(1L);
        verify(townService).mapToResponse(town);
    }

    @Test
    void getTownByIdThrowsWhenTownDoesNotExist() {
        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminTownService.getTownById(99L));

        verify(townRepository).findById(99L);
        verify(townService, never()).mapToResponse(any(Town.class));
    }

    @Test
    void createTownCreatesTownWithProvidedSlug() {
        TownCreateRequest request = validCreateRequest();
        request.setSlug("nuevo-pueblo");

        when(townRepository.existsBySlug("nuevo-pueblo")).thenReturn(false);
        when(townRepository.save(any(Town.class))).thenReturn(town);
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        TownResponse result = adminTownService.createTown(request);

        assertThat(result).isSameAs(townResponse);
        verify(townRepository).existsBySlug("nuevo-pueblo");
        verify(townRepository).save(any(Town.class));
        verify(townService).mapToResponse(town);
    }

    @Test
    void createTownGeneratesSlugFromNameWhenSlugIsBlank() {
        TownCreateRequest request = validCreateRequest();
        request.setSlug(" ");
        request.setName("Sámara Centro");

        Town savedTown = Town.builder()
                .id(2L)
                .slug("samara-centro")
                .name("Sámara Centro")
                .description("Pueblo turístico")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        TownResponse response = TownResponse.builder()
                .id(2L)
                .slug("samara-centro")
                .name("Sámara Centro")
                .description("Pueblo turístico")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        when(townRepository.existsBySlug("samara-centro")).thenReturn(false);
        when(townRepository.save(any(Town.class))).thenReturn(savedTown);
        when(townService.mapToResponse(savedTown)).thenReturn(response);

        TownResponse result = adminTownService.createTown(request);

        assertThat(result.getSlug()).isEqualTo("samara-centro");
        verify(townRepository).existsBySlug("samara-centro");
        verify(townRepository).save(any(Town.class));
    }

    @Test
    void createTownUsesCostaRicaWhenCountryIsBlank() {
        TownCreateRequest request = validCreateRequest();
        request.setCountry(" ");

        when(townRepository.existsBySlug("playas-del-coco")).thenReturn(false);
        when(townRepository.save(any(Town.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(townService.mapToResponse(any(Town.class))).thenAnswer(invocation -> {
            Town saved = invocation.getArgument(0);
            return TownResponse.builder()
                    .id(saved.getId())
                    .slug(saved.getSlug())
                    .name(saved.getName())
                    .description(saved.getDescription())
                    .province(saved.getProvince())
                    .country(saved.getCountry())
                    .active(saved.getActive())
                    .build();
        });

        TownResponse result = adminTownService.createTown(request);

        assertThat(result.getCountry()).isEqualTo("Costa Rica");
        verify(townRepository).save(any(Town.class));
    }

    @Test
    void createTownThrowsWhenNameIsBlank() {
        TownCreateRequest request = validCreateRequest();
        request.setName(" ");

        assertThrows(BadRequestException.class, () -> adminTownService.createTown(request));

        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void createTownThrowsWhenSlugAlreadyExists() {
        TownCreateRequest request = validCreateRequest();

        when(townRepository.existsBySlug("playas-del-coco")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> adminTownService.createTown(request));

        verify(townRepository).existsBySlug("playas-del-coco");
        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void updateTownUpdatesExistingTown() {
        TownUpdateRequest request = validUpdateRequest();

        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(townRepository.existsBySlugAndIdNot("tamarindo", 1L)).thenReturn(false);
        when(townRepository.save(town)).thenReturn(town);
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        TownResponse result = adminTownService.updateTown(1L, request);

        assertThat(result).isSameAs(townResponse);
        assertThat(town.getSlug()).isEqualTo("tamarindo");
        assertThat(town.getName()).isEqualTo("Tamarindo");
        assertThat(town.getDescription()).isEqualTo("Destino actualizado");
        assertThat(town.getProvince()).isEqualTo("Guanacaste");
        assertThat(town.getCountry()).isEqualTo("Costa Rica");
        assertThat(town.getActive()).isTrue();

        verify(townRepository).findById(1L);
        verify(townRepository).existsBySlugAndIdNot("tamarindo", 1L);
        verify(townRepository).save(town);
    }

    @Test
    void updateTownThrowsWhenTownDoesNotExist() {
        TownUpdateRequest request = validUpdateRequest();

        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminTownService.updateTown(99L, request));

        verify(townRepository).findById(99L);
        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void updateTownThrowsWhenNameIsBlank() {
        TownUpdateRequest request = validUpdateRequest();
        request.setName(" ");

        when(townRepository.findById(1L)).thenReturn(Optional.of(town));

        assertThrows(BadRequestException.class, () -> adminTownService.updateTown(1L, request));

        verify(townRepository).findById(1L);
        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void updateTownThrowsWhenAnotherTownHasSameSlug() {
        TownUpdateRequest request = validUpdateRequest();

        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(townRepository.existsBySlugAndIdNot("tamarindo", 1L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> adminTownService.updateTown(1L, request));

        verify(townRepository).existsBySlugAndIdNot("tamarindo", 1L);
        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void updateTownUsesCostaRicaWhenCountryIsBlank() {
        TownUpdateRequest request = validUpdateRequest();
        request.setCountry("");

        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(townRepository.existsBySlugAndIdNot("tamarindo", 1L)).thenReturn(false);
        when(townRepository.save(town)).thenReturn(town);
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        adminTownService.updateTown(1L, request);

        assertThat(town.getCountry()).isEqualTo("Costa Rica");
        verify(townRepository).save(town);
    }

    @Test
    void toggleActiveChangesTownStatus() {
        when(townRepository.findById(1L)).thenReturn(Optional.of(town));
        when(townRepository.save(town)).thenReturn(town);
        when(townService.mapToResponse(town)).thenReturn(townResponse);

        TownResponse result = adminTownService.toggleActive(1L);

        assertThat(result).isSameAs(townResponse);
        assertThat(town.getActive()).isFalse();
        verify(townRepository).save(town);
    }

    @Test
    void toggleActiveThrowsWhenTownDoesNotExist() {
        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminTownService.toggleActive(99L));

        verify(townRepository).findById(99L);
        verify(townRepository, never()).save(any(Town.class));
    }

    @Test
    void deleteTownDeletesExistingTown() {
        when(townRepository.findById(1L)).thenReturn(Optional.of(town));

        adminTownService.deleteTown(1L);

        verify(townRepository).findById(1L);
        verify(townRepository).delete(town);
    }

    @Test
    void deleteTownThrowsWhenTownDoesNotExist() {
        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> adminTownService.deleteTown(99L));

        verify(townRepository).findById(99L);
        verify(townRepository, never()).delete(any(Town.class));
    }

    private TownCreateRequest validCreateRequest() {
        TownCreateRequest request = new TownCreateRequest();
        request.setSlug("playas-del-coco");
        request.setName("Playas del Coco");
        request.setDescription("Destino turístico costero");
        request.setProvince("Guanacaste");
        request.setCountry("Costa Rica");
        request.setActive(true);
        return request;
    }

    private TownUpdateRequest validUpdateRequest() {
        TownUpdateRequest request = new TownUpdateRequest();
        request.setSlug("tamarindo");
        request.setName("Tamarindo");
        request.setDescription("Destino actualizado");
        request.setProvince("Guanacaste");
        request.setCountry("Costa Rica");
        request.setActive(true);
        return request;
    }
}