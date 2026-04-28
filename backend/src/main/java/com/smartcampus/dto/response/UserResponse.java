package com.smartcampus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserResponse {

    private String id;
    private String username;
    private String email;
    private String fullName;
    private String profilePicture;
    private Set<String> roles;
    private LocalDateTime createdAt;
}