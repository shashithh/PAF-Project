package com.smartcampus.service.impl;

import com.smartcampus.dto.response.NotificationResponse;
import com.smartcampus.entity.Notification;
import com.smartcampus.enums.NotificationType;
import com.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {

    private final NotificationRepository repo;

    public void create(String recipient, String title, String message, NotificationType type, String refId) {
        Notification notification = Notification.builder()
                .recipientUsername(recipient)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(refId)
                .read(false)
                .build();

        repo.save(notification);
    }

    public List<NotificationResponse> getForUser(String username) {
        return repo.findByRecipientUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public long countUnread(String username) {
        return repo.countByRecipientUsernameAndReadFalse(username);
    }

    public void markRead(String id, String username) {
        Notification notification = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipientUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }

        notification.setRead(true);
        repo.save(notification);
    }

    public void markAllRead(String username) {
        repo.findByRecipientUsernameAndReadFalseOrderByCreatedAtDesc(username)
                .forEach(notification -> {
                    notification.setRead(true);
                    repo.save(notification);
                });
    }

    private NotificationResponse toDto(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientUsername(notification.getRecipientUsername())
                .message(notification.getMessage())
                .title(notification.getTitle())
                .type(notification.getType())
                .referenceId(notification.getReferenceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}