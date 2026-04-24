package com.smartcampus.booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    /** All bookings for a specific user, newest first. */
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    /** All bookings for a specific status, newest first. */
    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    /** All bookings for a specific resource, newest first. */
    List<Booking> findByResourceIdOrderByCreatedAtDesc(String resourceId);

    /** All bookings on a specific date, newest first. */
    List<Booking> findByDateOrderByCreatedAtDesc(LocalDate date);

    /** All bookings for a user filtered by status. */
    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, BookingStatus status);

    /**
     * Find active bookings that overlap the requested time slot.
     *
     * Overlap condition: existing.start < requested.end AND existing.end > requested.start
     * Only PENDING and APPROVED bookings block a slot.
     */
    @Query("{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ['PENDING','APPROVED'] }, 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } }")
    List<Booking> findConflicting(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
