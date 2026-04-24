package com.smartcampus.facilities.controller;

import com.smartcampus.facilities.dto.request.ResourceRequestDto;
import com.smartcampus.facilities.dto.response.AnalyticsResponseDto;
import com.smartcampus.facilities.dto.response.ApiResponse;
import com.smartcampus.facilities.dto.response.ResourceResponseDto;
import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import com.smartcampus.facilities.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Facilities & Assets Catalogue (Module A).
 *
 * Base URL: /api/resources
 *
 * Endpoints implemented:
 *  POST   /api/resources                    → Create resource          [ADMIN]
 *  GET    /api/resources                    → List/search resources    [USER, ADMIN]
 *  GET    /api/resources/{id}               → Get single resource      [USER, ADMIN]
 *  PUT    /api/resources/{id}               → Update resource          [ADMIN]
 *  DELETE /api/resources/{id}               → Delete resource          [ADMIN]
 *  PATCH  /api/resources/{id}/status        → Change status            [ADMIN]
 *  GET    /api/resources/analytics          → Dashboard analytics      [ADMIN]
 *
 * HTTP status codes used:
 *  201 Created      → successful resource creation
 *  200 OK           → successful read, update, status change
 *  204 No Content   → successful deletion
 *  400 Bad Request  → validation errors, business rule violations
 *  401 Unauthorized → not authenticated
 *  403 Forbidden    → insufficient role
 *  404 Not Found    → resource not found
 *  409 Conflict     → duplicate resourceCode
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server
public class ResourceController {

    private final ResourceService resourceService;

    // =========================================================
    // POST /api/resources  →  Create a new resource
    // ACCESS: ADMIN only
    // =========================================================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseDto>> createResource(
            @Valid @RequestBody ResourceRequestDto dto) {

        ResourceResponseDto created = resourceService.createResource(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)  // 201
                .body(ApiResponse.success("Resource created successfully.", created));
    }

    // =========================================================
    // GET /api/resources  →  List all or search/filter
    // Supports query params: type, location, status, minCapacity
    // ACCESS: USER + ADMIN
    // =========================================================
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ResourceResponseDto>>> getResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer minCapacity) {

        List<ResourceResponseDto> resources =
                resourceService.searchResources(type, location, status, minCapacity);

        return ResponseEntity.ok(
                ApiResponse.success("Resources retrieved successfully.", resources));
    }

    // =========================================================
    // GET /api/resources/{id}  →  Get a single resource by ID
    // ACCESS: USER + ADMIN
    // =========================================================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseDto>> getResourceById(
            @PathVariable Long id) {

        ResourceResponseDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Resource retrieved successfully.", resource));
    }

    // =========================================================
    // PUT /api/resources/{id}  →  Full update of a resource
    // ACCESS: ADMIN only
    // =========================================================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseDto>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDto dto) {

        ResourceResponseDto updated = resourceService.updateResource(id, dto);
        return ResponseEntity.ok(
                ApiResponse.success("Resource updated successfully.", updated));
    }

    // =========================================================
    // DELETE /api/resources/{id}  →  Delete a resource
    // ACCESS: ADMIN only
    // =========================================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();  // 204
    }

    // =========================================================
    // PATCH /api/resources/{id}/status  →  Change resource status
    // Body: { "status": "OUT_OF_SERVICE" }
    // ACCESS: ADMIN only
    // =========================================================
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {

        ResourceResponseDto updated = resourceService.updateStatus(id, status);
        return ResponseEntity.ok(
                ApiResponse.success("Resource status updated to " + status + ".", updated));
    }

    // =========================================================
    // GET /api/resources/analytics  →  Dashboard analytics data
    // ACCESS: ADMIN only
    // =========================================================
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnalyticsResponseDto>> getAnalytics() {
        AnalyticsResponseDto analytics = resourceService.getAnalytics();
        return ResponseEntity.ok(
                ApiResponse.success("Analytics retrieved successfully.", analytics));
    }
}
