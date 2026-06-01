package com.turismo.backend.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.turismo.backend.auth.dto.AuthResponse;
import com.turismo.backend.auth.dto.GoogleLoginRequest;
import com.turismo.backend.auth.exception.InvalidGoogleTokenException;
import com.turismo.backend.security.JwtService;
import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.entity.Role;
import com.turismo.backend.user.entity.User;
import com.turismo.backend.user.repository.UserRepository;
import com.turismo.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        if (request.getIdToken() == null || request.getIdToken().isBlank()) {
            throw new InvalidGoogleTokenException("Google token is required");
        }

        GoogleIdToken.Payload payload = googleTokenVerifierService.verify(request.getIdToken());

        String email = payload.getEmail();
        Boolean emailVerified = payload.getEmailVerified();

        if (email == null || !email.endsWith("@gmail.com")) {
            throw new InvalidGoogleTokenException("Only Gmail accounts are allowed");
        }

        if (emailVerified == null || !emailVerified) {
            throw new InvalidGoogleTokenException("Google email is not verified");
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUser(payload));

        if (!user.getActive()) {
            throw new InvalidGoogleTokenException("User is inactive");
        }

        String token = jwtService.generateToken(user);
        UserResponse userResponse = userService.mapToResponse(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }

    private User createUser(GoogleIdToken.Payload payload) {
        User user = User.builder()
                .googleId(payload.getSubject())
                .email(payload.getEmail())
                .name((String) payload.get("name"))
                .pictureUrl((String) payload.get("picture"))
                .role(Role.CLIENT)
                .active(true)
                .build();

        return userRepository.save(user);
    }
}