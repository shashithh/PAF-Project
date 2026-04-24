package com.smartcampus.facilities.entity;

import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * JPA Entity representing a bookable campus resource.
 * Mapped to the 'resources' table in MySQL.
 *
 * NOTE: We do NOT expose this entity directly via API.
 *       DTOs (ResourceRequestDto / ResourceResponseDto) are used instead.
 */
@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    /** Auto-generated primary key */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-readable unique code for the resource (e.g., LH-001, LAB-002).
     * Must be unique across all resources.
     */
    @Column(name = "resource_code", nullable = false, unique = true, length = 50)
    private String resourceCode;

    /** Display name of the resource (e.g., "Main Auditorium") */
    @Column(name = "resource_name", nullable = false, length = 150)
    private String resourceName;

    /**
     * Category of the resource.
     * Stored as a String in DB using EnumType.STRING for readability.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false, length = 50)
    private ResourceType resourceType;

    /**
     * Maximum number of people the resource can accommodate.
     * For equipment (projectors, cameras), this is typically 1.
     */
    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    /** Physical location of the resource on campus */
    @Column(name = "location", nullable = false, length = 200)
    private String location;

    /** Start of daily availability window (e.g., 08:00) */
    @Column(name = "available_from")
    private LocalTime availableFrom;

    /** End of daily availability window (e.g., 20:00) */
    @Column(name = "available_to")
    private LocalTime availableTo;

    /**
     * Operational status: ACTIVE or OUT_OF_SERVICE.
     * OUT_OF_SERVICE resources remain in the catalogue but cannot be booked.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    /** Optional free-text description with additional details */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Automatically set when the record is first created */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Automatically updated whenever the record is modified */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
