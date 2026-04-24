package com.smartcampus.facilities.service;

import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.entity.UserRole;
import com.smartcampus.facilities.repository.RoleRepository;
import com.smartcampus.facilities.repository.UserRepository;
import com.smartcampus.facilities.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    // Get all roles
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Get role by id
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    // Create new role
    public Role createRole(String name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        return roleRepository.save(role);
    }

    // Update role
    public Role updateRole(Long id, String name, String description) {
        Role role = getRoleById(id);
        role.setName(name);
        role.setDescription(description);
        return roleRepository.save(role);
    }

    // Delete role
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    // Assign role to user
    public UserRole assignRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = getRoleById(roleId);

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        return userRoleRepository.save(userRole);
    }

    // Remove role from user
    public void removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<UserRole> userRoles = userRoleRepository.findByUser(user);
        userRoles.stream()
                .filter(ur -> ur.getRole().getId().equals(roleId))
                .findFirst()
                .ifPresent(ur -> userRoleRepository.deleteById(ur.getId()));
    }

    // Get all roles of a user
    public List<UserRole> getUserRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userRoleRepository.findByUser(user);
    }
}