package com.smartcampus.dto.response;
import lombok.Builder;
import lombok.Data;
import java.util.Map;
@Data @Builder
public class TicketAnalyticsResponse {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long rejectedTickets;
    private Map<String, Long> byCategory;
    private Map<String, Long> byPriority;
}
