package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.request.AssignRoleRequestDto;
import com.smartcampus.facilities.dto.response.RoleResponseDto;
import com.smartcampus.facilities.dto.response.UserResponseDto;
import com.smartcampus.facilities.dto.response.UserRoleResponseDto;
import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.mapper.UserMapper;
import com.smartcampus.facilities.repository.RoleRepository;
import com.smartcampus.facilities.repository.UserRoleRepository;
import com.smartcampus.facilities.service.RoleService;
import com.smartcampus.facilities.service.UserRoleService;
import com.smartcampus.facilities.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserRoleService userRoleService;
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;


    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleResponseDto>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleResponseDto> roleDTOs = roles.stream()
                .map(userMapper::toRoleResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roleDTOs);
    }

    @PostMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignRole(
            @PathVariable Long id,
            @RequestBody AssignRoleRequestDto request) {
        try {
            UserRoleResponseDto result = userService.assignRole(id, request.getRoleId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User already has this role")) {
                // return a 400 with a message
                return ResponseEntity.badRequest().body(Map.of("error", "User already has this role"));
            }
            throw e;
        }
    }

    @PutMapping("/users/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUserRoles(
            @PathVariable Long id,
            @RequestBody AssignRoleRequestDto request) {
        return ResponseEntity.ok(userService.updateUserRoles(id, request.getRoleIds()));
    }

    @DeleteMapping("/remove/role")
    public ResponseEntity<Void> removeRole(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long roleId = body.get("roleId");
        userRoleService.removeRoleFromUser(userId, roleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{id}/roles/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserRoleResponseDto>> getRoleHistory(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserRoleHistory(id));
    }
}