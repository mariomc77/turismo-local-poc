package com.turismo.backend.auth.dto;

import com.turismo.backend.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType;
    private UserResponse user;
}