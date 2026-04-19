package com.smartcampus.booking;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class BookingService {

    private final BookingRepository repo;

    /** Statuses a user is allowed to cancel from. */
    private static final Set<BookingStatus> CANCELLABLE =
        Set.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    /** Statuses an admin is allowed to approve from. */
    private static final Set<BookingStatus> APPROVABLE =
        Set.of(BookingStatus.PENDING);

    /** Statuses an admin is allowed to reject from. */
    private static final Set<BookingStatus> REJECTABLE =
        Set.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    // ── Queries ───────────────────────────────────────────────

    public List<Booking> findAll() {
        return repo.findAll();
    }

    public List<Booking> findByUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ── Conflict detection ────────────────────────────────────

    public Booking firstConflict(ConflictCheckRequest req) {
        List<Booking> hits = repo.findConflicting(
            req.resourceId(), req.date(),
            req.startTime(), req.endTime(),
            req.excludeId()
        );
        return hits.isEmpty() ? null : hits.get(0);
    }

    public boolean hasConflict(ConflictCheckRequest req) {
        return repo.existsConflicting(
            req.resourceId(), req.date(),
            req.startTime(), req.endTime(),
            req.excludeId()
        );
    }

    // ── Mutations ─────────────────────────────────────────────

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
     * Cancel a booking on behalf of the user who owns it.
     *
     * Rules:
     * - Only PENDING or APPROVED bookings can be cancelled.
     * - The booking date must not be in the past.
     * - The requesting user must own the booking.
     */
    @Transactional
    public Booking cancel(Long id, String requestingUserId) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        if (!b.getUserId().equals(requestingUserId)) {
            throw new ForbiddenException("You can only cancel your own bookings.");
        }

        if (!CANCELLABLE.contains(b.getStatus())) {
            throw new InvalidTransitionException(
                "Cannot cancel a booking with status '%s'. Only PENDING or APPROVED bookings can be cancelled."
                    .formatted(b.getStatus())
            );
        }

        if (b.getDate().isBefore(LocalDate.now())) {
            throw new InvalidTransitionException(
                "Cannot cancel a booking that has already passed."
            );
        }

        b.setStatus(BookingStatus.CANCELLED);
        return repo.save(b);
    }

    /**
     * Update the status of a booking (admin: approve or reject).
     *
     * Rules:
     * - Only PENDING bookings can be approved.
     * - Only PENDING or APPROVED bookings can be rejected.
     * - Approving re-checks for conflicts in case another booking was
     *   approved in the meantime.
     */
    @Transactional
    public Booking updateStatus(Long id, BookingStatus status) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));

        switch (status) {
            case APPROVED -> {
                if (!APPROVABLE.contains(b.getStatus())) {
                    throw new InvalidTransitionException(
                        "Cannot approve a booking with status '%s'.".formatted(b.getStatus())
                    );
                }
                ConflictCheckRequest check = new ConflictCheckRequest(
                    b.getResourceId(), b.getDate(),
                    b.getStartTime(), b.getEndTime(), id
                );
                if (hasConflict(check)) {
                    throw new ConflictException(
                        "Cannot approve: '%s' has a conflicting approved booking on %s."
                            .formatted(b.getResourceName(), b.getDate())
                    );
                }
            }
            case REJECTED -> {
                if (!REJECTABLE.contains(b.getStatus())) {
                    throw new InvalidTransitionException(
                        "Cannot reject a booking with status '%s'.".formatted(b.getStatus())
                    );
                }
            }
            case CANCELLED ->
                // Admins should use the cancel endpoint; this path is a fallback
                throw new InvalidTransitionException(
                    "Use the cancel endpoint to cancel a booking."
                );
            default ->
                throw new InvalidTransitionException(
                    "Unsupported status transition to '%s'.".formatted(status)
                );
        }

        b.setStatus(status);
        return repo.save(b);
    }
}
