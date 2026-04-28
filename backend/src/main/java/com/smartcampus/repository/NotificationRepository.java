package com.smartcampus.repository;

import com.smartcampus.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(String username);

    List<Notification> findByRecipientUsernameAndReadFalseOrderByCreatedAtDesc(String username);

    long countByRecipientUsernameAndReadFalse(String username);
}