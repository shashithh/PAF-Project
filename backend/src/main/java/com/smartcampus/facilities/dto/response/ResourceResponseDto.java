package com.smartcampus.facilities.dto.response;

import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * DTO returned to clients for resource data (GET responses).
 *
 * This is the outbound contract — clients receive this structure.
 * We never expose the JPA entity directly.
 *
 * Includes all fields the frontend needs to display resource details,
 * including audit timestamps (createdAt, updatedAt).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDto {

    private Long id;
    private String resourceCode;
    private String resourceName;
    private ResourceType resourceType;
    private Integer capacity;
    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
