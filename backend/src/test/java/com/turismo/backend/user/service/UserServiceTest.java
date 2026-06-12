package com.turismo.backend.user.service;

import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.entity.Role;
import com.turismo.backend.user.entity.User;
import com.turismo.backend.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class UserServiceTest {

    @Test
    void mapToResponseMapsUserCorrectly() {
        UserRepository userRepository = mock(UserRepository.class);
        UserService userService = new UserService(userRepository);

        User user = User.builder()
                .id(5L)
                .googleId("google-5")
                .email("test@gmail.com")
                .name("Usuario Test")
                .pictureUrl("https://example.com/pic.jpg")
                .role(Role.CLIENT)
                .active(true)
                .build();

        UserResponse response = userService.mapToResponse(user);

        assertEquals(5L, response.getId());
        assertEquals("test@gmail.com", response.getEmail());
        assertEquals("Usuario Test", response.getName());
        assertEquals("https://example.com/pic.jpg", response.getPictureUrl());
        assertEquals(Role.CLIENT, response.getRole());
        assertTrue(response.getActive());
    }

    @Test
    void mapToResponseMapsAdminRole() {
        UserRepository userRepository = mock(UserRepository.class);
        UserService userService = new UserService(userRepository);

        User user = User.builder()
                .id(10L)
                .googleId("google-admin")
                .email("admin@gmail.com")
                .name("Admin User")
                .pictureUrl("https://example.com/admin.jpg")
                .role(Role.ADMIN)
                .active(true)
                .build();

        UserResponse response = userService.mapToResponse(user);

        assertEquals(10L, response.getId());
        assertEquals("admin@gmail.com", response.getEmail());
        assertEquals(Role.ADMIN, response.getRole());
        assertTrue(response.getActive());
    }
}