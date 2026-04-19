package com.smartcampus.config;

import com.smartcampus.booking.ConflictException;
import com.smartcampus.booking.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Converts exceptions into structured JSON responses using RFC 9457 ProblemDetail.
 * Every error body has at least: { "status", "title", "detail" }
 * Validation errors also include: { "errors": { "field": "message", ... } }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 409 — scheduling conflict */
    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.CONFLICT, ex.getMessage()
        );
        pd.setTitle("Scheduling Conflict");
        return pd;
    }

    /** 404 — booking not found */
    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage()
        );
        pd.setTitle("Not Found");
        return pd;
    }

    /** 400 — @Valid constraint violations */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                (a, b) -> a   // keep first message if field has multiple violations
            ));

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "One or more fields are invalid."
        );
        pd.setTitle("Validation Failed");
        pd.setProperty("errors", fieldErrors);
        return pd;
    }

    /** 500 — unexpected errors */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred."
        );
        pd.setTitle("Internal Server Error");
        return pd;
    }
}
