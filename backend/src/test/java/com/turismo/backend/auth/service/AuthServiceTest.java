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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private GoogleTokenVerifierService googleTokenVerifierService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginWithGoogleThrowsWhenTokenIsBlank() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("");

        assertThrows(InvalidGoogleTokenException.class,
                () -> authService.loginWithGoogle(request));

        verifyNoInteractions(googleTokenVerifierService);
    }

    @Test
    void loginWithGoogleThrowsWhenEmailIsNotGmail() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("valid-token");

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("user@hotmail.com");
        payload.setEmailVerified(true);
        payload.setSubject("google-123");

        when(googleTokenVerifierService.verify("valid-token")).thenReturn(payload);

        assertThrows(InvalidGoogleTokenException.class,
                () -> authService.loginWithGoogle(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginWithGoogleThrowsWhenEmailIsNotVerified() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("valid-token");

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("user@gmail.com");
        payload.setEmailVerified(false);
        payload.setSubject("google-123");

        when(googleTokenVerifierService.verify("valid-token")).thenReturn(payload);

        assertThrows(InvalidGoogleTokenException.class,
                () -> authService.loginWithGoogle(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginWithGoogleReturnsTokenForExistingUser() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("valid-token");

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("user@gmail.com");
        payload.setEmailVerified(true);
        payload.setSubject("google-123");

        User user = User.builder()
                .id(1L)
                .googleId("google-123")
                .email("user@gmail.com")
                .name("Usuario")
                .role(Role.CLIENT)
                .active(true)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(1L)
                .email("user@gmail.com")
                .name("Usuario")
                .role(Role.CLIENT)
                .build();

        when(googleTokenVerifierService.verify("valid-token")).thenReturn(payload);
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");
        when(userService.mapToResponse(user)).thenReturn(userResponse);

        AuthResponse response = authService.loginWithGoogle(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals("user@gmail.com", response.getUser().getEmail());

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginWithGoogleCreatesNewUserWhenNotExists() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("valid-token");

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("nuevo@gmail.com");
        payload.setEmailVerified(true);
        payload.setSubject("google-new");
        payload.set("name", "Nuevo Usuario");
        payload.set("picture", "https://example.com/pic.jpg");

        User savedUser = User.builder()
                .id(2L)
                .googleId("google-new")
                .email("nuevo@gmail.com")
                .name("Nuevo Usuario")
                .pictureUrl("https://example.com/pic.jpg")
                .role(Role.CLIENT)
                .active(true)
                .build();

        UserResponse userResponse = UserResponse.builder()
                .id(2L)
                .email("nuevo@gmail.com")
                .name("Nuevo Usuario")
                .role(Role.CLIENT)
                .build();

        when(googleTokenVerifierService.verify("valid-token")).thenReturn(payload);
        when(userRepository.findByEmail("nuevo@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt-created");
        when(userService.mapToResponse(savedUser)).thenReturn(userResponse);

        AuthResponse response = authService.loginWithGoogle(request);

        assertEquals("jwt-created", response.getToken());
        assertEquals("nuevo@gmail.com", response.getUser().getEmail());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void loginWithGoogleThrowsWhenUserIsInactive() {
        GoogleLoginRequest request = new GoogleLoginRequest();
        request.setIdToken("valid-token");

        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail("inactive@gmail.com");
        payload.setEmailVerified(true);
        payload.setSubject("google-123");

        User user = User.builder()
                .id(1L)
                .googleId("google-123")
                .email("inactive@gmail.com")
                .name("Inactive")
                .role(Role.CLIENT)
                .active(false)
                .build();

        when(googleTokenVerifierService.verify("valid-token")).thenReturn(payload);
        when(userRepository.findByEmail("inactive@gmail.com")).thenReturn(Optional.of(user));

        assertThrows(InvalidGoogleTokenException.class,
                () -> authService.loginWithGoogle(request));

        verify(jwtService, never()).generateToken(any());
    }
}