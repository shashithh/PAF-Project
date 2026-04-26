package com.smartcampus.dto.response;

import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class ResourceResponse {

    private String id;
    private String name;
    private ResourceType type;
    private String description;
    private Integer capacity;
    private String location;
    private String building;
    private Integer floorNumber;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String amenities;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}