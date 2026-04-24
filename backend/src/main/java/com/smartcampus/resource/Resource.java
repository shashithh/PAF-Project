package com.smartcampus.resource;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Bookable campus resource — Module B view.
 *
 * This is a READ-ONLY projection used by the booking flow to display
 * resource names, capacity, and type when a user selects a resource.
 * Module B never creates or updates resources — that is Module A's job.
 *
 * MERGE NOTE:
 *   After merge, DELETE this class entirely and use Module A's entity:
 *     com.smartcampus.facilities.entity.Resource
 *   Then update ResourceRepository and ResourceController to import from
 *   that package. The MongoDB collection name ("resources") is the same,
 *   so no data migration is needed.
 *
 *   Fields added here (location, status, availableFrom, availableTo,
 *   resourceCode, description) match Module A's entity exactly so that
 *   documents written by Module A are readable by Module B's GET /api/resources.
 */
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank
    private String name;

    private int capacity;

    /** lab | room | equipment  (Module B simple types) */
    private String type;

    // ── Fields added for Module A compatibility ───────────────
    // These are populated by Module A when it creates resources.
    // Module B reads them for display purposes only.

    /** e.g. "LH-001" — set by Module A */
    private String resourceCode;

    /** Module A canonical name field (same value as 'name') */
    private String resourceName;

    /** LECTURE_HALL | LAB | MEETING_ROOM | PROJECTOR | CAMERA | OTHER */
    private String resourceType;

    /** Physical location on campus */
    private String location;

    /** ACTIVE | OUT_OF_SERVICE */
    private String status = "ACTIVE";

    /** Optional description */
    private String description;

    // ── Getters ───────────────────────────────────────────────

    public String getId()               { return id; }
    public String getName()             { return name != null ? name : resourceName; }
    public int    getCapacity()         { return capacity; }
    public String getType()             { return type != null ? type : resourceType; }
    public String getResourceCode()     { return resourceCode; }
    public String getResourceName()     { return resourceName; }
    public String getResourceType()     { return resourceType; }
    public String getLocation()         { return location; }
    public String getStatus()           { return status; }
    public String getDescription()      { return description; }

    // ── Setters ───────────────────────────────────────────────

    public void setId(String id)                      { this.id = id; }
    public void setName(String name)                  { this.name = name; }
    public void setCapacity(int capacity)             { this.capacity = capacity; }
    public void setType(String type)                  { this.type = type; }
    public void setResourceCode(String resourceCode)  { this.resourceCode = resourceCode; }
    public void setResourceName(String resourceName)  { this.resourceName = resourceName; }
    public void setResourceType(String resourceType)  { this.resourceType = resourceType; }
    public void setLocation(String location)          { this.location = location; }
    public void setStatus(String status)              { this.status = status; }
    public void setDescription(String description)    { this.description = description; }
}
