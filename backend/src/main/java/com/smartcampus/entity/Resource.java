package com.smartcampus.entity;

import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
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

    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    private String imageUrl;
    private String amenities;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}