package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.entity.Resource;
import com.smartcampus.facilities.enums.ResourceStatus;
import com.smartcampus.facilities.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Resource entities.
 *
 * Provides:
 * - Standard CRUD via JpaRepository
 * - Custom search/filter query via JPQL
 * - Duplicate-check query for resourceCode
 * - Analytics aggregation queries
 *
 * The @Query annotation uses JPQL (Java Persistence Query Language),
 * not raw SQL, which keeps it database-agnostic.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    /**
     * Check if a resource with the given code exists (used to prevent duplicates on create).
     */
    boolean existsByResourceCode(String resourceCode);

    /**
     * Check if another resource has the same code (excluding current record — used on update).
     */
    boolean existsByResourceCodeAndIdNot(String resourceCode, Long id);

    /**
     * Find by resource code (case-insensitive).
     */
    Optional<Resource> findByResourceCodeIgnoreCase(String resourceCode);

    /**
     * Flexible search/filter query supporting combinations of filters.
     *
     * All parameters are optional (null means "ignore this filter").
     * Uses LOWER() for case-insensitive string matching.
     *
     * Supported filters:
     *  - type: exact match on ResourceType enum
     *  - location: partial match (LIKE %location%)
     *  - status: exact match on ResourceStatus enum
     *  - minCapacity: resources with capacity >= this value
     *
     * Example usage:
     *   searchResources(ResourceType.LAB, null, ResourceStatus.ACTIVE, 0)
     *   → returns all active labs
     */
    @Query("""
        SELECT r FROM Resource r
        WHERE (:type IS NULL OR r.resourceType = :type)
          AND (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:status IS NULL OR r.status = :status)
          AND (:minCapacity IS NULL OR r.capacity >= :minCapacity)
        ORDER BY r.resourceName ASC
        """)
    List<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("location") String location,
            @Param("status") ResourceStatus status,
            @Param("minCapacity") Integer minCapacity
    );

    /**
     * Count resources by status — used for analytics dashboard.
     */
    long countByStatus(ResourceStatus status);

    /**
     * Count resources by type — used for analytics dashboard.
     */
    long countByResourceType(ResourceType resourceType);
}
