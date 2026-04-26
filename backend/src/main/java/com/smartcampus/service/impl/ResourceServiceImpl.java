package com.smartcampus.service.impl;

import com.smartcampus.dto.request.ResourceRequest;
import com.smartcampus.dto.response.ResourceResponse;
import com.smartcampus.entity.Resource;
import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl {

    private final ResourceRepository repo;

    public ResourceResponse create(ResourceRequest req) {
        Resource resource = Resource.builder()
                .name(req.getName())
                .type(req.getType())
                .description(req.getDescription())
                .capacity(req.getCapacity())
                .location(req.getLocation())
                .building(req.getBuilding())
                .floorNumber(req.getFloorNumber())
                .availableFrom(req.getAvailableFrom())
                .availableTo(req.getAvailableTo())
                .status(req.getStatus() != null ? req.getStatus() : ResourceStatus.ACTIVE)
                .amenities(req.getAmenities())
                .imageUrl(req.getImageUrl())
                .build();

        return toDto(repo.save(resource));
    }

    public List<ResourceResponse> getAll(
            ResourceType type,
            ResourceStatus status,
            String location,
            Integer minCapacity) {
        return repo.findAll()
                .stream()
                .filter(resource -> type == null || resource.getType() == type)
                .filter(resource -> status == null || resource.getStatus() == status)
                .filter(resource -> location == null || location.isBlank()
                        || resource.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(resource -> minCapacity == null
                        || resource.getCapacity() != null && resource.getCapacity() >= minCapacity)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ResourceResponse getById(String id) {
        Resource resource = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + id));

        return toDto(resource);
    }

    public ResourceResponse update(String id, ResourceRequest req) {
        Resource resource = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + id));

        resource.setName(req.getName());
        resource.setType(req.getType());
        resource.setDescription(req.getDescription());
        resource.setCapacity(req.getCapacity());
        resource.setLocation(req.getLocation());
        resource.setBuilding(req.getBuilding());
        resource.setFloorNumber(req.getFloorNumber());
        resource.setAvailableFrom(req.getAvailableFrom());
        resource.setAvailableTo(req.getAvailableTo());

        if (req.getStatus() != null) {
            resource.setStatus(req.getStatus());
        }

        resource.setAmenities(req.getAmenities());
        resource.setImageUrl(req.getImageUrl());

        return toDto(repo.save(resource));
    }

    public void delete(String id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Resource not found: " + id);
        }

        repo.deleteById(id);
    }

    private ResourceResponse toDto(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .description(resource.getDescription())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .building(resource.getBuilding())
                .floorNumber(resource.getFloorNumber())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .amenities(resource.getAmenities())
                .imageUrl(resource.getImageUrl())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}