package com.smartcampus.dto.response;
import lombok.Builder;
import lombok.Data;
import java.util.Set;
@Data @Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
}
