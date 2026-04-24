package com.smartcampus.facilities.dto.request;

import com.smartcampus.facilities.entity.Notification;
import lombok.Data;

@Data
public class CreateNotificationRequestDto {
    private String message;
    private Notification.NotificationType type;
}
