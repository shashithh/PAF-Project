package com.smartcampus.facilities.service;

import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.entity.UserRole;
import com.smartcampus.facilities.repository.UserRepository;
import com.smartcampus.facilities.repository.RoleRepository;
import com.smartcampus.facilities.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRoleService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    /**
     * Delete a user_role record by userId and roleId
     */
    public void removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        UserRole userRole = userRoleRepository.findByUserAndRole(user, role)
                .orElseThrow(() -> new RuntimeException("User role not found"));

        userRoleRepository.delete(userRole);
    }
}
