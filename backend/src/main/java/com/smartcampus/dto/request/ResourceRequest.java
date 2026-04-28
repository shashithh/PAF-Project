package com.smartcampus.dto.request;
import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalTime;
@Data
public class ResourceRequest {
    @NotBlank private String name;
    @NotNull private ResourceType type;
    private String description;
    @Min(1) private Integer capacity;
    @NotBlank private String location;
    private String building;
    private Integer floorNumber;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String amenities;
    private String imageUrl;
}
