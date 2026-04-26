package com.smartcampus.dto.request;
import com.smartcampus.enums.TicketCategory;
import com.smartcampus.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class TicketRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotNull private TicketCategory category;
    private TicketPriority priority = TicketPriority.MEDIUM;
    @NotBlank private String location;
    private String preferredContact;
}
