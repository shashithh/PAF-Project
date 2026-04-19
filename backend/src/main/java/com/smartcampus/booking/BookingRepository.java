package com.smartcampus.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /** All bookings for a specific user, newest first. */
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Returns all active bookings that overlap the requested slot.
     *
     * Overlap condition (Allen's interval algebra):
     *   existing.start < requested.end  AND  existing.end > requested.start
     *
     * Only PENDING and APPROVED bookings block a slot.
     * An optional {@code excludeId} lets us skip the booking being edited
     * (pass {@code null} when creating).
     */
    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.date       = :date
          AND b.status IN (
              com.smartcampus.booking.BookingStatus.PENDING,
              com.smartcampus.booking.BookingStatus.APPROVED
          )
          AND b.startTime  < :endTime
          AND b.endTime    > :startTime
          AND (:excludeId IS NULL OR b.id <> :excludeId)
    """)
    List<Booking> findConflicting(
        @Param("resourceId") String resourceId,
        @Param("date")       LocalDate date,
        @Param("startTime")  LocalTime startTime,
        @Param("endTime")    LocalTime endTime,
        @Param("excludeId")  Long excludeId
    );

    /**
     * Lightweight existence check — avoids loading full entities
     * when we only need to know whether a conflict exists.
     */
    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.date       = :date
          AND b.status IN (
              com.smartcampus.booking.BookingStatus.PENDING,
              com.smartcampus.booking.BookingStatus.APPROVED
          )
          AND b.startTime  < :endTime
          AND b.endTime    > :startTime
          AND (:excludeId IS NULL OR b.id <> :excludeId)
    """)
    boolean existsConflicting(
        @Param("resourceId") String resourceId,
        @Param("date")       LocalDate date,
        @Param("startTime")  LocalTime startTime,
        @Param("endTime")    LocalTime endTime,
        @Param("excludeId")  Long excludeId
    );
}
