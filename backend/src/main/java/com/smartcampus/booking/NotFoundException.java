package com.smartcampus.booking;

/** Thrown when a booking ID does not exist. Mapped to 404 by GlobalExceptionHandler. */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
