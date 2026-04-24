package com.smartcampus.facilities.dto.response;

import lombok.*;

import java.util.Map;

/**
 * DTO returned by the /api/resources/analytics endpoint.
 * Powers the dashboard analytics widget on the frontend.
 *
 * Contains:
 *  - totalResources: total count of all resources
 *  - activeResources: count of ACTIVE resources
 *  - outOfServiceResources: count of OUT_OF_SERVICE resources
 *  - resourcesByType: breakdown count per ResourceType
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponseDto {

    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;

    /** Map of ResourceType name → count (e.g., {"LAB": 2, "LECTURE_HALL": 3}) */
    private Map<String, Long> resourcesByType;
}
