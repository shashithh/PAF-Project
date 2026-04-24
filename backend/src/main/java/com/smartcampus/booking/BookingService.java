package com.smartcampus.booking;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository repo;

    private static final Set<BookingStatus> CANCELLABLE =
        Set.of(BookingStatus.PENDING, BookingStatus.APPROVED);
    private static final Set<BookingStatus> APPROVABLE =
        Set.of(BookingStatus.PENDING);
    private static final Set<BookingStatus> REJECTABLE =
        Set.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // ── Queries ───────────────────────────────────────────────

    /** Return all bookings, optionally filtered by status / userId / resourceId / date. */
    public List<Booking> findAll(BookingStatus status, String userId,
                                 String resourceId, LocalDate date) {
        // userId + status combo
        if (userId != null && status != null)
            return repo.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);

        if (userId != null)
            return repo.findByUserIdOrderByCreatedAtDesc(userId);

        if (status != null)
            return repo.findByStatusOrderByCreatedAtDesc(status);

        if (resourceId != null)
            return repo.findByResourceIdOrderByCreatedAtDesc(resourceId);

        if (date != null)
            return repo.findByDateOrderByCreatedAtDesc(date);

        return repo.findAll();
    }

    public List<Booking> findByUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ── Conflict detection ────────────────────────────────────

    /**
     * Returns the first conflicting booking, or null if the slot is free.
     * excludeId: skip this booking ID when checking (used when approving).
     */
    public Booking firstConflict(ConflictCheckRequest req) {
        List<Booking> hits = repo.findConflicting(
            req.resourceId(), req.date(), req.startTime(), req.endTime()
        );
        return hits.stream()
            .filter(b -> req.excludeId() == null || !req.excludeId().equals(b.getId()))
            .findFirst()
            .orElse(null);
    }

    public boolean hasConflict(ConflictCheckRequest req) {
        return firstConflict(req) != null;
    }

    // ── Mutations ─────────────────────────────────────────────

    public Booking create(BookingRequest req) {
        // Conflict check
        ConflictCheckRequest check = new ConflictCheckRequest(
            req.resourceId(), req.date(), req.startTime(), req.endTime(), null
        );
        Booking conflict = firstConflict(check);
        if (conflict != null) {
            throw new ConflictException(
                "Resource '%s' is already booked from %s to %s on %s."
                    .formatted(req.resourceName(),
                        conflict.getStartTime(), conflict.getEndTime(), conflict.getDate())
            );
        }

        Booking b = new Booking();
        b.setUserId(req.userId());
        b.setUserName(req.userName());
        b.setResourceId(req.resourceId());
        b.setResourceName(req.resourceName());
        b.setDate(req.date());
        b.setStartTime(req.startTime());
        b.setEndTime(req.endTime());
        b.setPurpose(req.purpose());
        b.setAttendees(req.attendees());
        return repo.save(b);
    }

    public Booking cancel(String id, String requestingUserId) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        if (!b.getUserId().equals(requestingUserId))
            throw new ForbiddenException("You can only cancel your own bookings.");

        if (!CANCELLABLE.contains(b.getStatus()))
            throw new InvalidTransitionException(
                "Cannot cancel a booking with status '%s'.".formatted(b.getStatus()));

        if (b.getDate().isBefore(LocalDate.now()))
            throw new InvalidTransitionException("Cannot cancel a booking that has already passed.");

        b.setStatus(BookingStatus.CANCELLED);
        return repo.save(b);
    }

    public Booking updateStatus(String id, BookingStatus status, String reason) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        switch (status) {
            case APPROVED -> {
                if (!APPROVABLE.contains(b.getStatus()))
                    throw new InvalidTransitionException(
                        "Cannot approve a booking with status '%s'.".formatted(b.getStatus()));

                // Re-check conflicts at approval time (another booking may have been approved since)
                ConflictCheckRequest check = new ConflictCheckRequest(
                    b.getResourceId(), b.getDate(), b.getStartTime(), b.getEndTime(), id
                );
                if (hasConflict(check))
                    throw new ConflictException(
                        "Cannot approve: '%s' has a conflicting approved booking on %s."
                            .formatted(b.getResourceName(), b.getDate()));
            }
            case REJECTED -> {
                if (!REJECTABLE.contains(b.getStatus()))
                    throw new InvalidTransitionException(
                        "Cannot reject a booking with status '%s'.".formatted(b.getStatus()));
                // Store the admin's reason
                if (reason != null && !reason.isBlank())
                    b.setRejectionReason(reason.trim());
            }
            case CANCELLED ->
                throw new InvalidTransitionException("Use the cancel endpoint to cancel a booking.");
            default ->
                throw new InvalidTransitionException(
                    "Unsupported status transition to '%s'.".formatted(status));
        }

        b.setStatus(status);
        return repo.save(b);
    }
}
