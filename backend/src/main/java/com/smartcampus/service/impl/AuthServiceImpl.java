package com.smartcampus.service.impl;

import com.smartcampus.dto.request.LoginRequest;
import com.smartcampus.dto.request.RegisterRequest;
import com.smartcampus.dto.response.AuthResponse;
import com.smartcampus.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

        private final UserRepository userRepo;
        private final PasswordEncoder encoder;
        private final AuthenticationManager authManager;
        private final JwtUtils jwtUtils;

        public AuthResponse register(RegisterRequest req) {
                if (userRepo.existsByUsername(req.getUsername())) {
                        throw new RuntimeException("Username already taken");
                }

                if (userRepo.existsByEmail(req.getEmail())) {
                        throw new RuntimeException("Email already registered");
                }

                Set<String> selectedRoles = req.getRoles() != null && !req.getRoles().isEmpty()
                                ? req.getRoles()
                                                .stream()
                                                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                                                .collect(Collectors.toSet())
                                : Set.of("ROLE_USER");

                User user = User.builder()
                                .username(req.getUsername())
                                .email(req.getEmail())
                                .password(encoder.encode(req.getPassword()))
                                .fullName(req.getFullName())
                                .roles(selectedRoles)
                                .enabled(true)
                                .build();

                userRepo.save(user);

                String token = jwtUtils.generateTokenFromUsername(user.getUsername());

                return AuthResponse.builder()
                                .token(token)
                                .tokenType("Bearer")
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .roles(user.getRoles())
                                .build();
        }

        public AuthResponse login(LoginRequest req) {
                Authentication auth = authManager.authenticate(
                                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

                String token = jwtUtils.generateToken(auth);

                User user = userRepo.findByUsername(req.getUsername()).orElseThrow();

                return AuthResponse.builder()
                                .token(token)
                                .tokenType("Bearer")
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .roles(user.getRoles())
                                .build();
        }
}