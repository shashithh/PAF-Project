package com.smartcampus.dto.request;
import com.smartcampus.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class BookingReviewRequest {
    @NotNull private BookingStatus status;
    private String adminNotes;
}
