package com.smartcampus.booking;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    /** GET /api/bookings — all bookings (admin) */
    @GetMapping
    public List<Booking> getAll() {
        return service.findAll();
    }

    /** GET /api/bookings?userId={id} — bookings for one user */
    @GetMapping(params = "userId")
    public List<Booking> getByUser(@RequestParam String userId) {
        return service.findByUser(userId);
    }

    /** POST /api/bookings — create a booking */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingRequest request) {
        return service.create(request);
    }

    /** PATCH /api/bookings/{id}/status — approve / reject / cancel */
    @PatchMapping("/{id}/status")
    public Booking updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest request
    ) {
        return service.updateStatus(id, request.status());
    }
}
