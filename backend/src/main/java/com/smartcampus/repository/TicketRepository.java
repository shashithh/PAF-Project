package com.smartcampus.repository;

import com.smartcampus.entity.Ticket;
import com.smartcampus.enums.TicketCategory;
import com.smartcampus.enums.TicketPriority;
import com.smartcampus.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReporterUsernameOrderByCreatedAtDesc(String username);

    long countByStatus(TicketStatus status);

    long countByCategory(TicketCategory category);

    long countByPriority(TicketPriority priority);
}