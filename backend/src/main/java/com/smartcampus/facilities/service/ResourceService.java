package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.request.ResourceRequestDto;
import com.smartcampus.facilities.dto.response.AnalyticsResponseDto;
import com.smartcampus.facilities.dto.response.ResourceResponseDto;
import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;

import java.util.List;

/**
 * Service interface for Facilities & Assets Catalogue operations.
 *
 * Defines the contract for all business logic operations.
 * The controller depends on this interface — not the implementation —
 * following the Dependency Inversion Principle.
 */
public interface ResourceService {

    /**
     * Create a new bookable resource.
     *
     * @param dto the incoming resource data
     * @return the created resource
     * @throws com.smartcampus.facilities.exception.DuplicateResourceException if resourceCode exists
     * @throws com.smartcampus.facilities.exception.InvalidTimeRangeException if availableFrom >= availableTo
     */
    ResourceResponseDto createResource(ResourceRequestDto dto);

    /**
     * Retrieve a single resource by ID.
     *
     * @param id the resource primary key
     * @return the resource data
     * @throws com.smartcampus.facilities.exception.ResourceNotFoundException if not found
     */
    ResourceResponseDto getResourceById(Long id);

    /**
     * Search and filter resources.
     * All parameters are optional — null means "no filter".
     *
     * @param type        filter by ResourceType
     * @param location    partial location match (case-insensitive)
     * @param status      filter by ResourceStatus
     * @param minCapacity minimum capacity threshold
     * @return filtered list of resources
     */
    List<ResourceResponseDto> searchResources(
            ResourceType type,
            String location,
            ResourceStatus status,
            Integer minCapacity
    );

    /**
     * Update an existing resource.
     *
     * @param id  the resource to update
     * @param dto the new data
     * @return the updated resource
     * @throws com.smartcampus.facilities.exception.ResourceNotFoundException if not found
     */
    ResourceResponseDto updateResource(Long id, ResourceRequestDto dto);

    /**
     * Delete a resource permanently.
     *
     * @param id the resource to delete
     * @throws com.smartcampus.facilities.exception.ResourceNotFoundException if not found
     */
    void deleteResource(Long id);

    /**
     * Toggle a resource's status between ACTIVE and OUT_OF_SERVICE.
     *
     * @param id     the resource to update
     * @param status the new status
     * @return the updated resource
     */
    ResourceResponseDto updateStatus(Long id, ResourceStatus status);

    /**
     * Get analytics summary for the dashboard widget.
     *
     * @return counts per status and type
     */
    AnalyticsResponseDto getAnalytics();
}
