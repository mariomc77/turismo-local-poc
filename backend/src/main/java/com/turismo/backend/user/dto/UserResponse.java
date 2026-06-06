package com.turismo.backend.user.dto;

import com.turismo.backend.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String googleId;
    private String email;
    private String name;
    private String pictureUrl;
    private Role role;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}