package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.response.UserResponseDto;
import com.smartcampus.facilities.dto.response.UserRoleResponseDto;
import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.entity.UserRole;
import com.smartcampus.facilities.mapper.UserMapper;
import com.smartcampus.facilities.repository.RoleRepository;
import com.smartcampus.facilities.repository.UserRepository;
import com.smartcampus.facilities.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserMapper userMapper;

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> userMapper.toUserResponseDto(
                        user,
                        userRoleRepository.findByUser(user)))
                .collect(Collectors.toList());
    }

    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<UserRole> userRoles = userRoleRepository.findByUser(user);
        return userMapper.toUserResponseDto(user, userRoles);
    }

    @Transactional
    public UserRoleResponseDto assignRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        boolean exists = userRoleRepository.findByUser(user).stream()
                .anyMatch(ur -> ur.getRole().getId().equals(roleId));
        if (exists) {
            throw new RuntimeException("User already has this role");
        }

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        return userMapper.toUserRoleResponseDto(userRoleRepository.save(userRole));
    }

    @Transactional
    public UserResponseDto updateUserRoles(Long userId, List<Long> roleIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserRole> existingRoles = userRoleRepository.findByUser(user);
        userRoleRepository.deleteAll(existingRoles);

        List<UserRole> newRoles = roleIds.stream().map(roleId -> {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleId));
            UserRole userRole = new UserRole();
            userRole.setUser(user);
            userRole.setRole(role);
            return userRoleRepository.save(userRole);
        }).collect(Collectors.toList());

        return userMapper.toUserResponseDto(user, newRoles);
    }

    public List<UserRoleResponseDto> getUserRoleHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userRoleRepository.findByUser(user).stream()
                .map(userMapper::toUserRoleResponseDto)
                .collect(Collectors.toList());
    }
}