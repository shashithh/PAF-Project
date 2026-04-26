package com.smartcampus.repository;

import com.smartcampus.entity.Booking;
import com.smartcampus.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByRequesterUsernameOrderByCreatedAtDesc(String username);

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate bookingDate);
}