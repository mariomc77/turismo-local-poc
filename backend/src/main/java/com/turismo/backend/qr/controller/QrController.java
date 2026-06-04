package com.turismo.backend.qr.controller;

import com.turismo.backend.qr.entity.QrResponse;
import com.turismo.backend.qr.service.QrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/towns")
public class QrController {

    private final QrService qrService;

    public QrController(QrService qrService) {
        this.qrService = qrService;
    }

    @GetMapping("/{slug}/qr")
    public ResponseEntity<QrResponse> getTownQr(@PathVariable String slug) {
        return ResponseEntity.ok(qrService.getQrByTownSlug(slug));
    }
}