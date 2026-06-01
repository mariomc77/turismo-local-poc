package com.turismo.backend.user.service;

import com.turismo.backend.common.exception.ResourceNotFoundException;
import com.turismo.backend.user.dto.UserResponse;
import com.turismo.backend.user.entity.User;
import com.turismo.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailAndActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return mapToResponse(user);
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .role(user.getRole())
                .build();
    }
}