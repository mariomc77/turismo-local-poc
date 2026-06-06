package com.turismo.backend.user.controller;

import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users/me")
    public UserResponse getMe(Authentication authentication) {
        return userService.getCurrentUser(authentication.getName());
    }

    @GetMapping("/api/admin/users")
    public List<UserResponse> getAdminUsers() {
        return userService.getAllUsers();
    }
}