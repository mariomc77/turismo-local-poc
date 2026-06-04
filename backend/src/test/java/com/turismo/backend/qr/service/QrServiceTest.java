package com.turismo.backend.qr.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.qr.entity.QrResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QrServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private QrService qrService;

    @Test
    void getQrByTownSlug_whenTownExists_returnsQrResponse() {
        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        ReflectionTestUtils.setField(qrService, "frontendBaseUrl", "http://localhost:5173");

        when(townRepository.findBySlugAndActiveTrue("playas-del-coco"))
                .thenReturn(Optional.of(town));

        QrResponse response = qrService.getQrByTownSlug("playas-del-coco");

        assertThat(response).isNotNull();
        assertThat(response.townSlug()).isEqualTo("playas-del-coco");
        assertThat(response.townName()).isEqualTo("Playas del Coco");
        assertThat(response.qrUrl()).isEqualTo("http://localhost:5173/p/playas-del-coco");
    }

    @Test
    void getQrByTownSlug_whenTownDoesNotExist_throwsResourceNotFoundException() {
        when(townRepository.findBySlugAndActiveTrue("pueblo-falso"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> qrService.getQrByTownSlug("pueblo-falso"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Pueblo no encontrado");
    }
}