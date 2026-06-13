package com.turismo.backend.user.controller;

import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.entity.Role;
import com.turismo.backend.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Test
    void getCurrentUserReturnsCurrentUserFromAuthenticationName() {
        UserService userService = mock(UserService.class);
        Authentication authentication = mock(Authentication.class);
        UserController userController = new UserController(userService);

        UserResponse response = UserResponse.builder()
                .id(1L)
                .email("admin@test.com")
                .name("Admin Test")
                .role(Role.ADMIN)
                .active(true)
                .build();

        when(authentication.getName()).thenReturn("admin@test.com");
        when(userService.getCurrentUser("admin@test.com")).thenReturn(response);

        UserResponse result = userController.getCurrentUser(authentication);

        assertEquals(1L, result.getId());
        assertEquals("admin@test.com", result.getEmail());
        assertEquals("Admin Test", result.getName());
        assertEquals(Role.ADMIN, result.getRole());
        assertEquals(true, result.getActive());

        verify(authentication).getName();
        verify(userService).getCurrentUser("admin@test.com");
    }
}