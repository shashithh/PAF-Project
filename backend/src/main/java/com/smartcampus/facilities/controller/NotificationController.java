package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.request.CreateNotificationRequestDto;
import com.smartcampus.facilities.entity.Notification;
import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.repository.UserRepository;
import com.smartcampus.facilities.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // GET all notifications for logged in user
    @GetMapping("/{email}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Notification>> getNotificationsByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    // GET unread count
    @GetMapping("/unread-count")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        User user = getUser(oAuth2User);
        return ResponseEntity.ok(notificationService.countUnread(user));
    }

    // PUT mark one as read
    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // PUT mark all as read
    @PutMapping("/read-all")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        User user = getUser(oAuth2User);
        notificationService.markAllAsRead(user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Notification> createNotification(
            @AuthenticationPrincipal OAuth2User oAuth2User,
            @RequestBody CreateNotificationRequestDto request) {
        User user = getUser(oAuth2User);
        Notification notification = notificationService.createNotification(
                user,
                request.getMessage(),
                request.getType()
        );
        return ResponseEntity.ok(notification);
    }

    private User getUser(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}