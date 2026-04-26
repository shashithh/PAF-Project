package com.smartcampus.service.impl;

import com.smartcampus.dto.request.BookingRequest;
import com.smartcampus.dto.request.BookingReviewRequest;
import com.smartcampus.dto.response.BookingResponse;
import com.smartcampus.entity.Booking;
import com.smartcampus.entity.Resource;
import com.smartcampus.enums.BookingStatus;
import com.smartcampus.enums.NotificationType;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl {

    private final BookingRepository bookingRepo;
    private final ResourceRepository resourceRepo;
    private final NotificationServiceImpl notifService;

    public BookingResponse create(BookingRequest req, String username) {
        if (req.getEndTime().isBefore(req.getStartTime()) || req.getEndTime().equals(req.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        Resource resource = resourceRepo.findById(req.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        List<Booking> sameDayBookings = bookingRepo.findByResourceIdAndBookingDate(resource.getId(),
                req.getBookingDate());

        boolean hasConflict = sameDayBookings.stream()
                .anyMatch(existing -> existing.getStatus() != BookingStatus.CANCELLED &&
                        req.getStartTime().isBefore(existing.getEndTime()) &&
                        req.getEndTime().isAfter(existing.getStartTime()));

        if (hasConflict) {
            throw new RuntimeException("Resource is already booked for this time slot");
        }

        Booking booking = Booking.builder()
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .resourceLocation(resource.getLocation())
                .resourceType(resource.getType() != null ? resource.getType().name() : null)
                .requesterUsername(username)
                .bookingDate(req.getBookingDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .purpose(req.getPurpose())
                .expectedAttendees(req.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        return toDto(bookingRepo.save(booking));
    }

    public List<BookingResponse> getUserBookings(String username) {
        return bookingRepo.findByRequesterUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BookingResponse getById(String id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return toDto(booking);
    }

    public BookingResponse review(String id, BookingReviewRequest req, String adminUsername) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be reviewed");
        }

        booking.setStatus(req.getStatus());
        booking.setAdminNotes(req.getAdminNotes());
        booking.setReviewedBy(adminUsername);
        booking.setReviewedAt(LocalDateTime.now());

        Booking saved = bookingRepo.save(booking);

        String message = req.getStatus() == BookingStatus.APPROVED
                ? "Your booking for " + booking.getResourceName() + " on " + booking.getBookingDate()
                        + " has been APPROVED."
                : "Your booking for " + booking.getResourceName() + " on " + booking.getBookingDate()
                        + " has been REJECTED. "
                        + (req.getAdminNotes() != null ? req.getAdminNotes() : "");

        notifService.create(
                booking.getRequesterUsername(),
                req.getStatus() == BookingStatus.APPROVED ? "Booking Approved" : "Booking Rejected",
                message,
                req.getStatus() == BookingStatus.APPROVED
                        ? NotificationType.BOOKING_APPROVED
                        : NotificationType.BOOKING_REJECTED,
                id);

        return toDto(saved);
    }

    public BookingResponse cancel(String id, String username, boolean isAdmin) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!isAdmin && !booking.getRequesterUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return toDto(bookingRepo.save(booking));
    }

    private BookingResponse toDto(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .resourceName(booking.getResourceName())
                .resourceLocation(booking.getResourceLocation())
                .resourceType(booking.getResourceType())
                .requesterUsername(booking.getRequesterUsername())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .adminNotes(booking.getAdminNotes())
                .reviewedBy(booking.getReviewedBy())
                .reviewedAt(booking.getReviewedAt())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}