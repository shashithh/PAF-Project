package com.smartcampus.booking;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // ── Queries ───────────────────────────────────────────────

    /** Return all bookings (admin view). */
    public List<Booking> findAll() {
        return repo.findAll();
    }

    /** Return bookings for a single user, newest first. */
    public List<Booking> findByUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ── Conflict detection ────────────────────────────────────

    /**
     * Returns the first conflicting booking, or {@code null} if the slot is free.
     * Used internally before creating/updating a booking.
     */
    public Booking firstConflict(ConflictCheckRequest req) {
        List<Booking> hits = repo.findConflicting(
            req.resourceId(), req.date(),
            req.startTime(), req.endTime(),
            req.excludeId()
        );
        return hits.isEmpty() ? null : hits.get(0);
    }

    /**
     * Lightweight boolean check — used by the check-conflict endpoint
     * so the frontend can validate before the user submits.
     */
    public boolean hasConflict(ConflictCheckRequest req) {
        return repo.existsConflicting(
            req.resourceId(), req.date(),
            req.startTime(), req.endTime(),
            req.excludeId()
        );
    }

    // ── Mutations ─────────────────────────────────────────────

    /**
     * Create a new booking.
     * Throws {@link ConflictException} if the slot is already taken.
     */
    @Transactional
    public Booking create(BookingRequest req) {
        ConflictCheckRequest check = new ConflictCheckRequest(
            req.resourceId(), req.date(), req.startTime(), req.endTime(), null
        );
        Booking conflict = firstConflict(check);
        if (conflict != null) {
            throw new ConflictException(
                "Resource '%s' is already booked from %s to %s on %s."
                    .formatted(
                        req.resourceName(),
                        conflict.getStartTime(),
                        conflict.getEndTime(),
                        conflict.getDate()
                    )
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
        return repo.save(b);
    }

    /**
     * Update the status of an existing booking.
     * Throws {@link ConflictException} if approving a booking that now
     * conflicts with another approved booking.
     */
    @Transactional
    public Booking updateStatus(Long id, BookingStatus status) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        // Re-check conflicts when approving (another booking may have been
        // approved in the meantime for the same slot)
        if (status == BookingStatus.APPROVED) {
            ConflictCheckRequest check = new ConflictCheckRequest(
                b.getResourceId(), b.getDate(),
                b.getStartTime(), b.getEndTime(),
                id   // exclude self
            );
            if (hasConflict(check)) {
                throw new ConflictException(
                    "Cannot approve: '%s' has a conflicting approved booking on %s."
                        .formatted(b.getResourceName(), b.getDate())
                );
            }
        }

        b.setStatus(status);
        return repo.save(b);
    }
}
