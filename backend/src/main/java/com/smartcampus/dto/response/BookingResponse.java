package com.smartcampus.dto.response;

import com.smartcampus.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class BookingResponse {

    private String id;

    private String resourceId;
    private String resourceName;
    private String resourceLocation;
    private String resourceType;

    private String requesterUsername;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private Integer expectedAttendees;

    private BookingStatus status;

    private String adminNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
}