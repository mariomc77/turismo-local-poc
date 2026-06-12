package com.turismo.backend.admin.controller;

import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.dto.UserRoleUpdateRequest;
import com.turismo.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/{id}/role")
    public UserResponse updateUserRole(
            @PathVariable Long id,
            @RequestBody UserRoleUpdateRequest request
    ) {
        return userService.updateUserRole(id, request.getRole());
    }

    @PatchMapping("/{id}/toggle-active")
    public UserResponse toggleUserActive(@PathVariable Long id) {
        return userService.toggleUserActive(id);
    }
}