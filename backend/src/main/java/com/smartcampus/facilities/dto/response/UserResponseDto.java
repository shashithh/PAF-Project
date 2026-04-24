package com.smartcampus.facilities.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponseDto {
    private Long id;
    private String email;
    private String name;
    private String picture;
    private LocalDateTime createdAt;
    private List<RoleResponseDto> roles;
}