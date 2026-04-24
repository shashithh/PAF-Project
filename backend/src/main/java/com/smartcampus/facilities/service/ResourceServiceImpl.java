package com.smartcampus.facilities.service;

import com.smartcampus.facilities.dto.request.ResourceRequestDto;
import com.smartcampus.facilities.dto.response.AnalyticsResponseDto;
import com.smartcampus.facilities.dto.response.ResourceResponseDto;
import com.smartcampus.facilities.entity.Resource;
import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import com.smartcampus.facilities.exception.DuplicateResourceException;
import com.smartcampus.facilities.exception.InvalidTimeRangeException;
import com.smartcampus.facilities.exception.ResourceNotFoundException;
import com.smartcampus.facilities.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of ResourceService.
 *
 * Responsibilities:
 *  1. Apply business rules before calling the repository
 *  2. Map entities → DTOs (so entities never leak to controllers)
 *  3. Throw appropriate domain exceptions
 *
 * @Transactional ensures DB operations are wrapped in transactions.
 * @Slf4j provides a log field for logging important events.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    // =========================================================
    // CREATE
    // =========================================================

    @Override
    @Transactional
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        log.info("Creating resource with code: {}", dto.getResourceCode());

        // Business rule: resourceCode must be unique
        if (resourceRepository.existsByResourceCode(dto.getResourceCode())) {
            throw new DuplicateResourceException(dto.getResourceCode());
        }

        // Business rule: availableFrom must be before availableTo (if both provided)
        validateTimeRange(dto);

        // Map DTO → Entity
        Resource resource = mapToEntity(dto);

        // Default status to ACTIVE if not specified
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }

        Resource saved = resourceRepository.save(resource);
        log.info("Resource created with ID: {}", saved.getId());

        return mapToResponseDto(saved);
    }

    // =========================================================
    // READ (single)
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ResourceResponseDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return mapToResponseDto(resource);
    }

    // =========================================================
    // READ (search/filter list)
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponseDto> searchResources(
            ResourceType type,
            String location,
            ResourceStatus status,
            Integer minCapacity) {

        log.debug("Searching resources — type={}, location={}, status={}, minCapacity={}",
                type, location, status, minCapacity);

        // Treat empty strings as null so the SQL filter is skipped
        String locationFilter = (location != null && location.isBlank()) ? null : location;

        return resourceRepository
                .searchResources(type, locationFilter, status, minCapacity)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    @Transactional
    public ResourceResponseDto updateResource(Long id, ResourceRequestDto dto) {
        log.info("Updating resource ID: {}", id);

        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        // Business rule: if resourceCode changed, new code must not conflict
        if (!existing.getResourceCode().equals(dto.getResourceCode())
                && resourceRepository.existsByResourceCodeAndIdNot(dto.getResourceCode(), id)) {
            throw new DuplicateResourceException(dto.getResourceCode());
        }

        // Business rule: availableFrom must be before availableTo
        validateTimeRange(dto);

        // Apply updates
        existing.setResourceCode(dto.getResourceCode());
        existing.setResourceName(dto.getResourceName());
        existing.setResourceType(dto.getResourceType());
        existing.setCapacity(dto.getCapacity());
        existing.setLocation(dto.getLocation());
        existing.setAvailableFrom(dto.getAvailableFrom());
        existing.setAvailableTo(dto.getAvailableTo());
        existing.setDescription(dto.getDescription());

        // Only update status if explicitly provided
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        Resource updated = resourceRepository.save(existing);
        log.info("Resource updated: ID={}", updated.getId());

        return mapToResponseDto(updated);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    @Transactional
    public void deleteResource(Long id) {
        log.info("Deleting resource ID: {}", id);

        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }

        resourceRepository.deleteById(id);
        log.info("Resource deleted: ID={}", id);
    }

    // =========================================================
    // STATUS CHANGE
    // =========================================================

    @Override
    @Transactional
    public ResourceResponseDto updateStatus(Long id, ResourceStatus status) {
        log.info("Updating status of resource ID {} to {}", id, status);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        resource.setStatus(status);
        Resource updated = resourceRepository.save(resource);

        return mapToResponseDto(updated);
    }

    // =========================================================
    // ANALYTICS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponseDto getAnalytics() {
        long total = resourceRepository.count();
        long active = resourceRepository.countByStatus(ResourceStatus.ACTIVE);
        long outOfService = resourceRepository.countByStatus(ResourceStatus.OUT_OF_SERVICE);

        // Build a map with counts for each ResourceType
        Map<String, Long> byType = new LinkedHashMap<>();
        Arrays.stream(ResourceType.values()).forEach(type ->
                byType.put(type.name(), resourceRepository.countByResourceType(type))
        );

        return AnalyticsResponseDto.builder()
                .totalResources(total)
                .activeResources(active)
                .outOfServiceResources(outOfService)
                .resourcesByType(byType)
                .build();
    }

    // =========================================================
    // PRIVATE HELPERS
    // =========================================================

    /**
     * Maps a ResourceRequestDto to a Resource entity.
     * Used for both create and update operations.
     */
    private Resource mapToEntity(ResourceRequestDto dto) {
        return Resource.builder()
                .resourceCode(dto.getResourceCode().trim().toUpperCase())
                .resourceName(dto.getResourceName().trim())
                .resourceType(dto.getResourceType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation().trim())
                .availableFrom(dto.getAvailableFrom())
                .availableTo(dto.getAvailableTo())
                .status(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE)
                .description(dto.getDescription())
                .build();
    }

    /**
     * Maps a Resource entity to a ResourceResponseDto.
     * All API responses use this DTO — entities are never leaked.
     */
    private ResourceResponseDto mapToResponseDto(Resource resource) {
        return ResourceResponseDto.builder()
                .id(resource.getId())
                .resourceCode(resource.getResourceCode())
                .resourceName(resource.getResourceName())
                .resourceType(resource.getResourceType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }

    /**
     * Validates that availableFrom is strictly before availableTo.
     * Skips validation if either time is null (both are optional).
     */
    private void validateTimeRange(ResourceRequestDto dto) {
        if (dto.getAvailableFrom() != null && dto.getAvailableTo() != null) {
            if (!dto.getAvailableFrom().isBefore(dto.getAvailableTo())) {
                throw new InvalidTimeRangeException();
            }
        }
    }
}
