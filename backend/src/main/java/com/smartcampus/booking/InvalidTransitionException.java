package com.smartcampus.booking;

/** Thrown when a status transition is not allowed. Mapped to 422. */
public class InvalidTransitionException extends RuntimeException {
    public InvalidTransitionException(String message) {
        super(message);
    }
}
