package com.smartcampus.entity;

import com.smartcampus.enums.TicketCategory;
import com.smartcampus.enums.TicketPriority;
import com.smartcampus.enums.TicketStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;
    private TicketCategory category;

    @Builder.Default
    private TicketPriority priority = TicketPriority.MEDIUM;

    private String location;
    private String reporterUsername;
    private String assignedTo;

    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;

    private String preferredContact;
    private String resolutionNotes;
    private String rejectionReason;
    private String imagePaths;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}