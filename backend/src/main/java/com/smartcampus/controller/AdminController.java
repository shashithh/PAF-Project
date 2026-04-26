package com.smartcampus.controller;

import com.smartcampus.dto.response.ApiResponse;
import com.smartcampus.entity.User;
import com.smartcampus.enums.BookingStatus;
import com.smartcampus.enums.TicketStatus;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "fullName", u.getFullName() != null ? u.getFullName() : "",
                        "roles", u.getRoles(),
                        "enabled", u.isEnabled(),
                        "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(@PathVariable String id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        return ResponseEntity.ok(ApiResponse.success("User retrieved", Map.<String, Object>of(
                "id", u.getId(),
                "username", u.getUsername(),
                "email", u.getEmail(),
                "fullName", u.getFullName() != null ? u.getFullName() : "",
                "roles", u.getRoles(),
                "enabled", u.isEnabled())));
    }

    @PatchMapping("/users/{id}/roles")
    public ResponseEntity<ApiResponse<Void>> updateRoles(
            @PathVariable String id,
            @RequestBody Map<String, Set<String>> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        Set<String> newRoles = body.get("roles");

        if (newRoles == null || newRoles.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Roles cannot be empty"));
        }

        user.setRoles(newRoles);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Roles updated"));
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggleUser(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User " + (user.isEnabled() ? "enabled" : "disabled")));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }

        userRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", Map.<String, Object>of(
                "totalUsers", userRepository.count(),
                "totalBookings", bookingRepository.count(),
                "totalTickets", ticketRepository.count(),
                "pendingBookings", bookingRepository.findByStatusOrderByCreatedAtDesc(BookingStatus.PENDING).size(),
                "openTickets", ticketRepository.countByStatus(TicketStatus.OPEN),
                "inProgressTickets", ticketRepository.countByStatus(TicketStatus.IN_PROGRESS),
                "resolvedTickets", ticketRepository.countByStatus(TicketStatus.RESOLVED))));
    }
}