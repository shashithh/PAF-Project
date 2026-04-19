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

    /** All bookings for a resource on a given date (for conflict detection). */
    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.date       = :date
          AND b.status IN ('PENDING', 'APPROVED')
          AND b.startTime  < :endTime
          AND b.endTime    > :startTime
    """)
    List<Booking> findConflicting(
        @Param("resourceId") String resourceId,
        @Param("date")       LocalDate date,
        @Param("startTime")  LocalTime startTime,
        @Param("endTime")    LocalTime endTime
    );
}
