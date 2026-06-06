package com.turismo.backend.qr.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.qr.entity.QrResponse;
import com.turismo.backend.town.entity.Town;
import com.turismo.backend.town.repository.TownRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QrService {

    private final TownRepository townRepository;

    @Value("${frontend.base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public QrService(TownRepository townRepository) {
        this.townRepository = townRepository;
    }

    public QrResponse getQrByTownSlug(String slug) {
        Town town = townRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Pueblo no encontrado"));

        String qrUrl = frontendBaseUrl + "/#/p/" + town.getSlug();

        return new QrResponse(
                town.getSlug(),
                town.getName(),
                qrUrl
        );
    }
}