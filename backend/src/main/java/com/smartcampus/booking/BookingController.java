package com.smartcampus.booking;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    /**
     * GET /api/bookings
     *
     * Optional query params (all combinable):
     *   ?userId=u1
     *   ?status=PENDING
     *   ?resourceId=r1
     *   ?date=2026-04-22
     *
     * Examples:
     *   GET /api/bookings                          → all bookings (admin)
     *   GET /api/bookings?userId=u1                → user's own bookings
     *   GET /api/bookings?status=PENDING           → all pending (admin)
     *   GET /api/bookings?userId=u1&status=APPROVED → user's approved bookings
     */
    @GetMapping
    public List<Booking> getAll(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.findAll(status, userId, resourceId, date);
    }

    /**
     * POST /api/bookings/check-conflict
     * Returns { conflict: false } or { conflict: true, detail: "..." }
     */
    @PostMapping("/check-conflict")
    public Map<String, Object> checkConflict(@Valid @RequestBody ConflictCheckRequest request) {
        Booking hit = service.firstConflict(request);
        if (hit == null) return Map.of("conflict", false);
        return Map.of(
            "conflict", true,
            "detail", "Already booked %s–%s on %s (status: %s)."
                .formatted(hit.getStartTime(), hit.getEndTime(), hit.getDate(), hit.getStatus())
        );
    }

    /**
     * POST /api/bookings
     * Creates a new booking in PENDING status.
     * Returns 409 if the slot is already taken.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingRequest request) {
        return service.create(request);
    }

    /**
     * DELETE /api/bookings/{id}?userId={userId}
     * Cancels a booking. Only the booking owner can cancel.
     * Returns 403 if userId doesn't match, 422 if status doesn't allow cancellation.
     */
    @DeleteMapping("/{id}")
    public Booking cancel(@PathVariable String id, @RequestParam String userId) {
        return service.cancel(id, userId);
    }

    /**
     * PATCH /api/bookings/{id}/status
     * Admin approves or rejects a booking.
     * Body: { "status": "APPROVED" } or { "status": "REJECTED", "reason": "Room unavailable" }
     * Returns 409 if approving would create a conflict, 422 for invalid transitions.
     */
    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable String id,
                                @Valid @RequestBody StatusUpdateRequest request) {
        return service.updateStatus(id, request.status(), request.reason());
    }
}
