package com.smartcampus.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    @NotBlank
    private String userId;

    @NotBlank
    private String userName;

    @NotBlank
    private String resourceId;

    @NotBlank
    private String resourceName;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotBlank
    private String purpose;

    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Getters ──────────────────────────────────────────────

    public String getId()                { return id; }
    public String getUserId()            { return userId; }
    public String getUserName()          { return userName; }
    public String getResourceId()        { return resourceId; }
    public String getResourceName()      { return resourceName; }
    public LocalDate getDate()           { return date; }
    public LocalTime getStartTime()      { return startTime; }
    public LocalTime getEndTime()        { return endTime; }
    public String getPurpose()           { return purpose; }
    public BookingStatus getStatus()     { return status; }
    public LocalDateTime getCreatedAt()  { return createdAt; }

    // ── Setters ──────────────────────────────────────────────

    public void setId(String id)                    { this.id = id; }
    public void setUserId(String userId)            { this.userId = userId; }
    public void setUserName(String userName)        { this.userName = userName; }
    public void setResourceId(String resourceId)    { this.resourceId = resourceId; }
    public void setResourceName(String resourceName){ this.resourceName = resourceName; }
    public void setDate(LocalDate date)             { this.date = date; }
    public void setStartTime(LocalTime startTime)   { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime)       { this.endTime = endTime; }
    public void setPurpose(String purpose)          { this.purpose = purpose; }
    public void setStatus(BookingStatus status)     { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt){ this.createdAt = createdAt; }
}
