package com.smartcampus.facilities.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when availableFrom is not before availableTo.
 * Maps to HTTP 400 Bad Request.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidTimeRangeException extends RuntimeException {

    public InvalidTimeRangeException() {
        super("'availableFrom' must be before 'availableTo'.");
    }
}
