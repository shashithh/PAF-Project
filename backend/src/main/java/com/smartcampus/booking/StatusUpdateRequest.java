package com.smartcampus.booking;

import jakarta.validation.constraints.NotNull;

/**
 * Inbound DTO for PATCH /api/bookings/{id}/status.
 * reason is optional — only meaningful (and stored) when status = REJECTED.
 */
public record StatusUpdateRequest(
    @NotNull BookingStatus status,
    String reason          // nullable
) {}
