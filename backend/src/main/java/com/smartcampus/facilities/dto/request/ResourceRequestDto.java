package com.smartcampus.facilities.dto.request;

import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalTime;

/**
 * DTO used for CREATE and UPDATE resource requests (POST / PUT).
 * Validation annotations ensure the API rejects bad input early,
 * returning clean 400 JSON error responses via GlobalExceptionHandler.
 *
 * The entity is never exposed directly — this DTO acts as a clean
 * contract between client and server.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestDto {

    /**
     * Unique resource code (e.g., LH-001).
     * Pattern allows letters, digits, and hyphens only.
     */
    @NotBlank(message = "Resource code is required")
    @Size(min = 2, max = 50, message = "Resource code must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z0-9\\-]+$", message = "Resource code can only contain letters, numbers, and hyphens")
    private String resourceCode;

    /** Human-readable display name */
    @NotBlank(message = "Resource name is required")
    @Size(min = 2, max = 150, message = "Resource name must be between 2 and 150 characters")
    private String resourceName;

    /** Type/category from the ResourceType enum */
    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;

    /**
     * Capacity must be >= 0.
     * Equipment like projectors/cameras have capacity = 1.
     */
    @NotNull(message = "Capacity is required")
    @Min(value = 0, message = "Capacity cannot be negative")
    @Max(value = 10000, message = "Capacity cannot exceed 10,000")
    private Integer capacity;

    /** Physical location on campus */
    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 200, message = "Location must be between 2 and 200 characters")
    private String location;

    /** Start time of daily availability window */
    private LocalTime availableFrom;

    /** End time of daily availability window */
    private LocalTime availableTo;

    /** Operational status — defaults to ACTIVE if not provided */
    private ResourceStatus status;

    /** Optional free-text description */
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
}
