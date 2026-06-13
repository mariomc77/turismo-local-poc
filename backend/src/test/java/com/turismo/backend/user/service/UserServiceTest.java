package com.turismo.backend.user.service;

import com.turismo.backend.common.exception.BadRequestException;
import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.entity.Role;
import com.turismo.backend.user.entity.User;
import com.turismo.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    private User clientUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository);

        clientUser = User.builder()
                .id(1L)
                .googleId("google-client")
                .email("client@test.com")
                .name("Cliente Test")
                .pictureUrl("https://example.com/client.jpg")
                .role(Role.CLIENT)
                .active(true)
                .createdAt(LocalDateTime.of(2026, 6, 10, 10, 0))
                .updatedAt(LocalDateTime.of(2026, 6, 11, 10, 0))
                .build();

        adminUser = User.builder()
                .id(2L)
                .googleId("google-admin")
                .email("admin@test.com")
                .name("Admin Test")
                .pictureUrl("https://example.com/admin.jpg")
                .role(Role.ADMIN)
                .active(true)
                .createdAt(LocalDateTime.of(2026, 6, 12, 10, 0))
                .updatedAt(LocalDateTime.of(2026, 6, 13, 10, 0))
                .build();
    }

    @Test
    void getCurrentUserReturnsMappedUser() {
        when(userRepository.findByEmail("client@test.com")).thenReturn(Optional.of(clientUser));

        UserResponse response = userService.getCurrentUser("client@test.com");

        assertEquals(1L, response.getId());
        assertEquals("client@test.com", response.getEmail());
        assertEquals("Cliente Test", response.getName());
        assertEquals(Role.CLIENT, response.getRole());
        assertTrue(response.getActive());

        verify(userRepository).findByEmail("client@test.com");
    }

    @Test
    void getCurrentUserThrowsWhenEmailDoesNotExist() {
        when(userRepository.findByEmail("missing@test.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getCurrentUser("missing@test.com"));

        verify(userRepository).findByEmail("missing@test.com");
    }

    @Test
    void getAllUsersReturnsUsersSortedByCreatedAtDescending() {
        User userWithoutDate = User.builder()
                .id(3L)
                .googleId("google-null")
                .email("null@test.com")
                .name("Sin Fecha")
                .role(Role.CLIENT)
                .active(true)
                .createdAt(null)
                .build();

        when(userRepository.findAll()).thenReturn(List.of(clientUser, userWithoutDate, adminUser));

        List<UserResponse> result = userService.getAllUsers();

        assertEquals(3, result.size());
        assertEquals("admin@test.com", result.get(0).getEmail());
        assertEquals("client@test.com", result.get(1).getEmail());
        assertEquals("null@test.com", result.get(2).getEmail());

        verify(userRepository).findAll();
    }

    @Test
    void updateUserRoleChangesClientToAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(clientUser));
        when(userRepository.save(clientUser)).thenReturn(clientUser);

        UserResponse response = userService.updateUserRole(1L, Role.ADMIN);

        assertEquals(Role.ADMIN, response.getRole());
        assertEquals(Role.ADMIN, clientUser.getRole());

        verify(userRepository).findById(1L);
        verify(userRepository).save(clientUser);
    }

    @Test
    void updateUserRoleChangesAdminToClient() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(adminUser));
        when(userRepository.save(adminUser)).thenReturn(adminUser);

        UserResponse response = userService.updateUserRole(2L, Role.CLIENT);

        assertEquals(Role.CLIENT, response.getRole());
        assertEquals(Role.CLIENT, adminUser.getRole());

        verify(userRepository).findById(2L);
        verify(userRepository).save(adminUser);
    }

    @Test
    void updateUserRoleThrowsWhenRoleIsNull() {
        assertThrows(BadRequestException.class, () -> userService.updateUserRole(1L, null));

        verify(userRepository, never()).findById(anyLong());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserRoleThrowsWhenUserDoesNotExist() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUserRole(99L, Role.ADMIN));

        verify(userRepository).findById(99L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void toggleUserActiveChangesTrueToFalse() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(clientUser));
        when(userRepository.save(clientUser)).thenReturn(clientUser);

        UserResponse response = userService.toggleUserActive(1L);

        assertFalse(response.getActive());
        assertFalse(clientUser.getActive());

        verify(userRepository).findById(1L);
        verify(userRepository).save(clientUser);
    }

    @Test
    void toggleUserActiveChangesFalseToTrue() {
        clientUser.setActive(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(clientUser));
        when(userRepository.save(clientUser)).thenReturn(clientUser);

        UserResponse response = userService.toggleUserActive(1L);

        assertTrue(response.getActive());
        assertTrue(clientUser.getActive());

        verify(userRepository).findById(1L);
        verify(userRepository).save(clientUser);
    }

    @Test
    void toggleUserActiveTreatsNullAsFalseAndActivatesUser() {
        clientUser.setActive(null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(clientUser));
        when(userRepository.save(clientUser)).thenReturn(clientUser);

        UserResponse response = userService.toggleUserActive(1L);

        assertTrue(response.getActive());
        assertTrue(clientUser.getActive());

        verify(userRepository).findById(1L);
        verify(userRepository).save(clientUser);
    }

    @Test
    void toggleUserActiveThrowsWhenUserDoesNotExist() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.toggleUserActive(99L));

        verify(userRepository).findById(99L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void mapToResponseMapsUserCorrectly() {
        UserResponse response = userService.mapToResponse(clientUser);

        assertEquals(1L, response.getId());
        assertEquals("google-client", response.getGoogleId());
        assertEquals("client@test.com", response.getEmail());
        assertEquals("Cliente Test", response.getName());
        assertEquals("https://example.com/client.jpg", response.getPictureUrl());
        assertEquals(Role.CLIENT, response.getRole());
        assertTrue(response.getActive());
        assertEquals(clientUser.getCreatedAt(), response.getCreatedAt());
        assertEquals(clientUser.getUpdatedAt(), response.getUpdatedAt());
    }

    @Test
    void mapToResponseMapsAdminRole() {
        UserResponse response = userService.mapToResponse(adminUser);

        assertEquals(2L, response.getId());
        assertEquals("admin@test.com", response.getEmail());
        assertEquals("Admin Test", response.getName());
        assertEquals(Role.ADMIN, response.getRole());
        assertTrue(response.getActive());
    }
}