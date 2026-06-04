package com.turismo.backend.qr.entity;

public record QrResponse(
        String townSlug,
        String townName,
        String qrUrl
) {
}