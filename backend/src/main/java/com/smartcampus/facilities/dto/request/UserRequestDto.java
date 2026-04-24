package com.smartcampus.facilities.dto.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserRequestDto {
    private Long id;
    private String email;
    private String name;
    private String picture;
    private LocalDateTime createdAt;
    private List<RoleRequestDto> roles;
}