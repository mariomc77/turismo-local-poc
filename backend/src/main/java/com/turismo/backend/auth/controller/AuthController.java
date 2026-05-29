package com.turismo.backend.auth.controller;

import com.turismo.backend.auth.dto.AuthResponse;
import com.turismo.backend.auth.dto.GoogleLoginRequest;
import com.turismo.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/auth/google")
    public AuthResponse loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request);
    }
}