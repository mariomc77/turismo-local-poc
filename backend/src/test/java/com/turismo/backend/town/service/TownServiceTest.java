package com.turismo.backend.town.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private TownService townService;

    private Town town;

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
    }

    @Test
    void getAllActiveTownsReturnsMappedTowns() {
        when(townRepository.findByActiveTrueOrderByNameAsc()).thenReturn(List.of(town));

        List<TownResponse> result = townService.getAllActiveTowns();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getSlug()).isEqualTo("playas-del-coco");
        assertThat(result.get(0).getName()).isEqualTo("Playas del Coco");
        verify(townRepository).findByActiveTrueOrderByNameAsc();
    }

    @Test
    void getTownBySlugReturnsTownResponse() {
        when(townRepository.findBySlugAndActiveTrue("playas-del-coco")).thenReturn(Optional.of(town));

        TownResponse result = townService.getTownBySlug("playas-del-coco");

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getSlug()).isEqualTo("playas-del-coco");
        assertThat(result.getName()).isEqualTo("Playas del Coco");
        verify(townRepository).findBySlugAndActiveTrue("playas-del-coco");
    }

    @Test
    void getTownBySlugThrowsWhenTownDoesNotExist() {
        when(townRepository.findBySlugAndActiveTrue("no-existe")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> townService.getTownBySlug("no-existe"));

        verify(townRepository).findBySlugAndActiveTrue("no-existe");
    }

    @Test
    void findActiveTownBySlugReturnsTown() {
        when(townRepository.findBySlugAndActiveTrue("playas-del-coco")).thenReturn(Optional.of(town));

        Town result = townService.findActiveTownBySlug("playas-del-coco");

        assertThat(result).isSameAs(town);
        verify(townRepository).findBySlugAndActiveTrue("playas-del-coco");
    }

    @Test
    void findActiveTownBySlugThrowsWhenTownDoesNotExist() {
        when(townRepository.findBySlugAndActiveTrue("inactivo")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> townService.findActiveTownBySlug("inactivo"));

        verify(townRepository).findBySlugAndActiveTrue("inactivo");
    }

    @Test
    void findTownByIdReturnsTown() {
        when(townRepository.findById(1L)).thenReturn(Optional.of(town));

        Town result = townService.findTownById(1L);

        assertThat(result).isSameAs(town);
        verify(townRepository).findById(1L);
    }

    @Test
    void findTownByIdThrowsWhenTownDoesNotExist() {
        when(townRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> townService.findTownById(99L));

        verify(townRepository).findById(99L);
    }

    @Test
    void findTownBySlugReturnsTown() {
        when(townRepository.findBySlug("playas-del-coco")).thenReturn(Optional.of(town));

        Town result = townService.findTownBySlug("playas-del-coco");

        assertThat(result).isSameAs(town);
        verify(townRepository).findBySlug("playas-del-coco");
    }

    @Test
    void findTownBySlugThrowsWhenTownDoesNotExist() {
        when(townRepository.findBySlug("no-existe")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> townService.findTownBySlug("no-existe"));

        verify(townRepository).findBySlug("no-existe");
    }

    @Test
    void mapToResponseMapsTownFields() {
        TownResponse result = townService.mapToResponse(town);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getSlug()).isEqualTo("playas-del-coco");
        assertThat(result.getName()).isEqualTo("Playas del Coco");
        assertThat(result.getDescription()).isEqualTo("Destino turístico costero");
        assertThat(result.getProvince()).isEqualTo("Guanacaste");
        assertThat(result.getCountry()).isEqualTo("Costa Rica");
        assertThat(result.getActive()).isTrue();
    }
}