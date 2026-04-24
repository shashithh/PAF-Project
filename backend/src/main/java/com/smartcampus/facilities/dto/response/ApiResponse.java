package com.smartcampus.facilities.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Generic API response wrapper.
 *
 * All API responses are wrapped in this structure to provide
 * consistent, predictable JSON to the frontend:
 *
 * {
 *   "success": true,
 *   "message": "Resource created successfully",
 *   "data": { ... },
 *   "timestamp": "2026-03-01T10:00:00"
 * }
 *
 * @param <T> the type of the data payload
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /** Convenience factory method for successful responses with data */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    /** Convenience factory method for successful responses without data */
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .build();
    }

    /** Convenience factory method for error responses */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
