package com.smartcampus.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Inbound DTO for POST /api/bookings.
 * Validation annotations are checked by @Valid in the controller.
 */
public record BookingRequest(

    @NotBlank String userId,
    @NotBlank String userName,
    @NotBlank String resourceId,
    @NotBlank String resourceName,
    @NotNull  LocalDate date,
    @NotNull  LocalTime startTime,
    @NotNull  LocalTime endTime,
    @NotBlank String purpose,

    /** Optional — number of expected attendees. 0 means not specified. */
    int attendees

) {}
