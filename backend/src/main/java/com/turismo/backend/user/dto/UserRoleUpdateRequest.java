package com.turismo.backend.user.dto;

import com.turismo.backend.user.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateRequest {

    private Role role;
}