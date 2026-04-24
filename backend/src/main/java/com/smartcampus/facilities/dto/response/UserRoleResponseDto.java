package com.smartcampus.facilities.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserRoleResponseDto {
    private Long id;
    private RoleResponseDto role;
    private LocalDateTime assignedAt;
}