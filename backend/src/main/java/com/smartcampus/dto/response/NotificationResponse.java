package com.smartcampus.dto.response;

import com.smartcampus.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private String id;
    private String recipientUsername;
    private String message;
    private String title;
    private NotificationType type;
    private String referenceId;
    private boolean read;
    private LocalDateTime createdAt;
}