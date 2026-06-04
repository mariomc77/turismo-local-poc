package com.turismo.backend.town.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.town.dto.TownResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private TownService townService;

    @Test
    void getTownBySlug_whenTownExists_returnsTownResponse() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .description("Destino turístico en Guanacaste")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        when(townRepository.findBySlugAndActiveTrue("playas-del-coco"))
                .thenReturn(Optional.of(town));

        TownResponse response = townService.getTownBySlug("playas-del-coco");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getSlug()).isEqualTo("playas-del-coco");
        assertThat(response.getName()).isEqualTo("Playas del Coco");
        assertThat(response.getProvince()).isEqualTo("Guanacaste");
        assertThat(response.getCountry()).isEqualTo("Costa Rica");
        assertThat(response.getActive()).isTrue();
    }

    @Test
    void getTownBySlug_whenTownDoesNotExist_throwsResourceNotFoundException() {
        when(townRepository.findBySlugAndActiveTrue("pueblo-falso"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> townService.getTownBySlug("pueblo-falso"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Pueblo no encontrado");
    }
}