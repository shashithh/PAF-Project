package com.smartcampus.dto.request;
import com.smartcampus.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class TicketStatusUpdate {
    @NotNull private TicketStatus status;
    private String resolutionNotes;
    private String rejectionReason;
    private String assignedTo;
}
