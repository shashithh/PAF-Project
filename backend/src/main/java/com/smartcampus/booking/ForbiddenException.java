package com.smartcampus.booking;

/** Thrown when a user tries to act on a booking they don't own. Mapped to 403. */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
