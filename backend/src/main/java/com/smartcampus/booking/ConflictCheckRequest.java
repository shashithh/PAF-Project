package com.smartcampus.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ConflictCheckRequest(
    @NotBlank String resourceId,
    @NotNull  LocalDate date,
    @NotNull  LocalTime startTime,
    @NotNull  LocalTime endTime,
    String excludeId   // nullable — MongoDB document ID (String)
) {}
