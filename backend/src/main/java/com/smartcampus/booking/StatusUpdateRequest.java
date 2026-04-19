package com.smartcampus.booking;

import jakarta.validation.constraints.NotNull;

/**
 * Inbound DTO for PATCH /api/bookings/{id}/status.
 */
public record StatusUpdateRequest(@NotNull BookingStatus status) {}
