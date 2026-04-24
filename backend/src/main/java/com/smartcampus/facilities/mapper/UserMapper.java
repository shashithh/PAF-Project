package com.smartcampus.facilities.mapper;

import com.smartcampus.facilities.dto.response.RoleResponseDto;
import com.smartcampus.facilities.dto.response.UserResponseDto;
import com.smartcampus.facilities.dto.response.UserRoleResponseDto;
import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.entity.UserRole;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponseDto toUserResponseDto(User user, List<UserRole> userRoles) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPicture(user.getPicture());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRoles(userRoles.stream()
                .map(ur -> toRoleResponseDto(ur.getRole()))
                .collect(Collectors.toList()));
        return dto;
    }

    public RoleResponseDto toRoleResponseDto(Role role) {
        RoleResponseDto dto = new RoleResponseDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }

    public UserRoleResponseDto toUserRoleResponseDto(UserRole userRole) {
        UserRoleResponseDto dto = new UserRoleResponseDto();
        dto.setId(userRole.getId());
        dto.setRole(toRoleResponseDto(userRole.getRole()));
        dto.setAssignedAt(userRole.getAssignedAt());
        return dto;
    }
}