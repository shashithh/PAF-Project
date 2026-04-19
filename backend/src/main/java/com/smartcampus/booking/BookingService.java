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

    /** Return all bookings (admin view). */
    public List<Booking> findAll() {
        return repo.findAll();
    }

    /** Return bookings for a single user. */
    public List<Booking> findByUser(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Create a new booking.
     * Throws {@link ConflictException} if the resource is already booked
     * for an overlapping time slot.
     */
    @Transactional
    public Booking create(BookingRequest req) {
        List<Booking> conflicts = repo.findConflicting(
            req.resourceId(), req.date(), req.startTime(), req.endTime()
        );
        if (!conflicts.isEmpty()) {
            Booking c = conflicts.get(0);
            throw new ConflictException(
                "Resource already booked from %s to %s on %s"
                    .formatted(c.getStartTime(), c.getEndTime(), c.getDate())
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
     * Update the status of an existing booking (admin approve/reject,
     * or user cancel).
     */
    @Transactional
    public Booking updateStatus(Long id, BookingStatus status) {
        Booking b = repo.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not found: " + id));
        b.setStatus(status);
        return repo.save(b);
    }
}
