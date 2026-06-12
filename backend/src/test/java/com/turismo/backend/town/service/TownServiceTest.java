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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private TownService townService;

    @Test
    void getTownBySlugReturnsTownResponse() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .description("Destino turístico")
                .province("Guanacaste")
                .country("Costa Rica")
                .active(true)
                .build();

        when(townRepository.findBySlugAndActiveTrue("playas-del-coco"))
                .thenReturn(Optional.of(town));

        TownResponse response = townService.getTownBySlug("playas-del-coco");

        assertEquals(1L, response.getId());
        assertEquals("playas-del-coco", response.getSlug());
        assertEquals("Playas del Coco", response.getName());
        assertTrue(response.getActive());

        verify(townRepository).findBySlugAndActiveTrue("playas-del-coco");
    }

    @Test
    void getTownBySlugThrowsWhenTownDoesNotExist() {
        when(townRepository.findBySlugAndActiveTrue("no-existe"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> townService.getTownBySlug("no-existe"));

        verify(townRepository).findBySlugAndActiveTrue("no-existe");
    }

    @Test
    void findActiveTownBySlugReturnsTown() {
        Town town = Town.builder()
                .id(1L)
                .slug("tamarindo")
                .name("Tamarindo")
                .active(true)
                .build();

        when(townRepository.findBySlugAndActiveTrue("tamarindo"))
                .thenReturn(Optional.of(town));

        Town result = townService.findActiveTownBySlug("tamarindo");

        assertEquals("tamarindo", result.getSlug());
        assertEquals("Tamarindo", result.getName());

        verify(townRepository).findBySlugAndActiveTrue("tamarindo");
    }

    @Test
    void findTownByIdReturnsTown() {
        Town town = Town.builder()
                .id(10L)
                .slug("samara")
                .name("Sámara")
                .active(true)
                .build();

        when(townRepository.findById(10L)).thenReturn(Optional.of(town));

        Town result = townService.findTownById(10L);

        assertEquals(10L, result.getId());
        assertEquals("samara", result.getSlug());

        verify(townRepository).findById(10L);
    }

    @Test
    void findTownBySlugReturnsTown() {
        Town town = Town.builder()
                .id(2L)
                .slug("nosara")
                .name("Nosara")
                .active(true)
                .build();

        when(townRepository.findBySlug("nosara")).thenReturn(Optional.of(town));

        Town result = townService.findTownBySlug("nosara");

        assertEquals(2L, result.getId());
        assertEquals("Nosara", result.getName());

        verify(townRepository).findBySlug("nosara");
    }
}