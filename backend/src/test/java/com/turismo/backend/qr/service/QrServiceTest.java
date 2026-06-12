package com.turismo.backend.qr.service;

import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QrServiceTest {

    @Test
    void getQrByTownSlugReturnsResponse() {
        TownRepository townRepository = mock(TownRepository.class);
        QrService qrService = new QrService(townRepository);

        ReflectionTestUtils.setField(
                qrService,
                "frontendBaseUrl",
                "https://turismo-local-poc.vercel.app"
        );

        Town town = Town.builder()
                .id(1L)
                .slug("playas-del-coco")
                .name("Playas del Coco")
                .active(true)
                .build();

        when(townRepository.findBySlugAndActiveTrue("playas-del-coco"))
                .thenReturn(Optional.of(town));

        Object response = qrService.getQrByTownSlug("playas-del-coco");

        assertNotNull(response);

        verify(townRepository).findBySlugAndActiveTrue("playas-del-coco");
    }
}