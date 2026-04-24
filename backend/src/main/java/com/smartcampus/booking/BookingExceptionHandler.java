package com.smartcampus.booking;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handles exceptions thrown by the Booking module and converts them to
 * structured RFC 9457 ProblemDetail JSON responses.
 *
 * Scoped to com.smartcampus.booking so it does NOT conflict with
 * Module A's GlobalExceptionHandler (com.smartcampus.facilities.exception).
 * Both handlers coexist after the GitHub merge — each handles its own exceptions.
 *
 * MERGE NOTE:
 *   Module A has its own GlobalExceptionHandler in:
 *     com.smartcampus.facilities.exception.GlobalExceptionHandler
 *   That class is annotated @RestControllerAdvice and handles:
 *     ResourceNotFoundException, DuplicateResourceException, InvalidTimeRangeException
 *   This class handles booking-specific exceptions only.
 *   There is NO class name collision because this class is named BookingExceptionHandler.
 */
@RestControllerAdvice(basePackages = "com.smartcampus.booking")
public class BookingExceptionHandler {

    /** 409 — time slot already booked */
    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT, ex.getMessage()
        );
        pd.setTitle("Scheduling Conflict");
        return pd;
    }

    /** 404 — booking ID not found */
    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage()
        );
        pd.setTitle("Not Found");
        return pd;
    }

    /** 403 — user tried to act on someone else's booking */
    @ExceptionHandler(ForbiddenException.class)
    public ProblemDetail handleForbidden(ForbiddenException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.FORBIDDEN, ex.getMessage()
        );
        pd.setTitle("Forbidden");
        return pd;
    }

    /** 422 — invalid status transition (e.g. approving an already-rejected booking) */
    @ExceptionHandler(InvalidTransitionException.class)
    public ProblemDetail handleInvalidTransition(InvalidTransitionException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage()
        );
        pd.setTitle("Invalid Status Transition");
        return pd;
    }

    /** 400 — @Valid constraint violations on booking request fields */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                (a, b) -> a
            ));

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "One or more fields are invalid."
        );
        pd.setTitle("Validation Failed");
        pd.setProperty("errors", fieldErrors);
        return pd;
    }
}
