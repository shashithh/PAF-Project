package com.smartcampus.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Inbound DTO for POST /api/bookings/check-conflict.
 * {@code excludeId} is optional — supply it when checking for an edit
 * so the booking being edited doesn't conflict with itself.
 */
public record ConflictCheckRequest(

    @NotBlank String resourceId,
    @NotNull  LocalDate date,
    @NotNull  LocalTime startTime,
    @NotNull  LocalTime endTime,
    Long excludeId   // nullable

) {}
