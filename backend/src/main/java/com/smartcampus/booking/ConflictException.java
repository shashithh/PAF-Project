package com.smartcampus.booking;

/** Thrown when a booking slot is already taken. Mapped to 409 by GlobalExceptionHandler. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
