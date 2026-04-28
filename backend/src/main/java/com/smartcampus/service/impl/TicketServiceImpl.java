package com.smartcampus.service.impl;

import com.smartcampus.dto.request.CommentRequest;
import com.smartcampus.dto.request.TicketRequest;
import com.smartcampus.dto.request.TicketStatusUpdate;
import com.smartcampus.dto.response.CommentResponse;
import com.smartcampus.dto.response.TicketAnalyticsResponse;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.entity.Ticket;
import com.smartcampus.entity.TicketComment;
import com.smartcampus.enums.NotificationType;
import com.smartcampus.enums.TicketCategory;
import com.smartcampus.enums.TicketPriority;
import com.smartcampus.enums.TicketStatus;
import com.smartcampus.repository.TicketCommentRepository;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl {

    private final TicketRepository ticketRepo;
    private final TicketCommentRepository commentRepo;
    private final NotificationServiceImpl notifService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public TicketResponse create(TicketRequest req, String username) {
        Ticket ticket = Ticket.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .priority(req.getPriority() != null ? req.getPriority() : TicketPriority.MEDIUM)
                .location(req.getLocation())
                .preferredContact(req.getPreferredContact())
                .reporterUsername(username)
                .status(TicketStatus.OPEN)
                .build();

        return toDto(ticketRepo.save(ticket));
    }

    public List<TicketResponse> getTickets(
            String username,
            boolean isAdmin,
            TicketStatus status,
            TicketCategory category,
            TicketPriority priority,
            String reporter) {
        List<Ticket> tickets = isAdmin
                ? ticketRepo.findAll()
                : ticketRepo.findByReporterUsernameOrderByCreatedAtDesc(username);

        return tickets.stream()
                .filter(ticket -> status == null || ticket.getStatus() == status)
                .filter(ticket -> category == null || ticket.getCategory() == category)
                .filter(ticket -> priority == null || ticket.getPriority() == priority)
                .filter(ticket -> reporter == null || reporter.isBlank()
                        || ticket.getReporterUsername().equalsIgnoreCase(reporter))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TicketResponse getById(String id) {
        return toDto(findTicket(id));
    }

    public TicketResponse updateStatus(String id, TicketStatusUpdate req, String username, boolean isAdmin) {
        Ticket ticket = findTicket(id);

        ticket.setStatus(req.getStatus());

        if (req.getResolutionNotes() != null) {
            ticket.setResolutionNotes(req.getResolutionNotes());
        }

        if (req.getRejectionReason() != null) {
            ticket.setRejectionReason(req.getRejectionReason());
        }

        if (req.getAssignedTo() != null) {
            ticket.setAssignedTo(req.getAssignedTo());
        }

        Ticket saved = ticketRepo.save(ticket);

        notifService.create(
                ticket.getReporterUsername(),
                "Ticket Status Updated",
                "Your ticket '" + ticket.getTitle() + "' status changed to " + req.getStatus(),
                NotificationType.TICKET_STATUS_CHANGED,
                id);

        return toDto(saved);
    }

    public void delete(String id) {
        if (!ticketRepo.existsById(id)) {
            throw new RuntimeException("Ticket not found: " + id);
        }

        ticketRepo.deleteById(id);
    }

    public TicketResponse uploadImages(String id, List<MultipartFile> files, String username) {
        Ticket ticket = findTicket(id);

        if (!ticket.getReporterUsername().equals(username)) {
            throw new RuntimeException("Only reporter can upload images");
        }

        List<String> existing = ticket.getImagePaths() != null && !ticket.getImagePaths().isEmpty()
                ? new ArrayList<>(Arrays.asList(ticket.getImagePaths().split(",")))
                : new ArrayList<>();

        if (existing.size() + files.size() > 3) {
            throw new RuntimeException("Maximum 3 images allowed");
        }

        try {
            Path dir = Paths.get(uploadDir, "tickets", id);
            Files.createDirectories(dir);

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), dir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                existing.add(fileName);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload images", e);
        }

        ticket.setImagePaths(String.join(",", existing));

        return toDto(ticketRepo.save(ticket));
    }

    public CommentResponse addComment(String ticketId, CommentRequest req, String username) {
        Ticket ticket = findTicket(ticketId);

        TicketComment comment = TicketComment.builder()
                .ticketId(ticket.getId())
                .authorUsername(username)
                .content(req.getContent())
                .build();

        TicketComment saved = commentRepo.save(comment);

        if (!ticket.getReporterUsername().equals(username)) {
            notifService.create(
                    ticket.getReporterUsername(),
                    "New Comment on Ticket",
                    "A new comment was added to your ticket '" + ticket.getTitle() + "'",
                    NotificationType.TICKET_COMMENT_ADDED,
                    ticketId);
        }

        return toCommentDto(saved);
    }

    public CommentResponse editComment(String ticketId, String commentId, CommentRequest req, String username) {
        TicketComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getTicketId().equals(ticketId)) {
            throw new RuntimeException("Comment does not belong to this ticket");
        }

        if (!comment.getAuthorUsername().equals(username)) {
            throw new RuntimeException("Not authorized to edit this comment");
        }

        comment.setContent(req.getContent());

        return toCommentDto(commentRepo.save(comment));
    }

    public void deleteComment(String ticketId, String commentId, String username, boolean isAdmin) {
        TicketComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getTicketId().equals(ticketId)) {
            throw new RuntimeException("Comment does not belong to this ticket");
        }

        if (!isAdmin && !comment.getAuthorUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }

        commentRepo.delete(comment);
    }

    public TicketAnalyticsResponse getAnalytics() {
        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (TicketCategory category : TicketCategory.values()) {
            byCategory.put(category.name(), ticketRepo.countByCategory(category));
        }

        Map<String, Long> byPriority = new LinkedHashMap<>();
        for (TicketPriority priority : TicketPriority.values()) {
            byPriority.put(priority.name(), ticketRepo.countByPriority(priority));
        }

        return TicketAnalyticsResponse.builder()
                .totalTickets(ticketRepo.count())
                .openTickets(ticketRepo.countByStatus(TicketStatus.OPEN))
                .inProgressTickets(ticketRepo.countByStatus(TicketStatus.IN_PROGRESS))
                .resolvedTickets(ticketRepo.countByStatus(TicketStatus.RESOLVED))
                .closedTickets(ticketRepo.countByStatus(TicketStatus.CLOSED))
                .rejectedTickets(ticketRepo.countByStatus(TicketStatus.REJECTED))
                .byCategory(byCategory)
                .byPriority(byPriority)
                .build();
    }

    private Ticket findTicket(String id) {
        return ticketRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    private TicketResponse toDto(Ticket ticket) {
        List<String> images = ticket.getImagePaths() != null && !ticket.getImagePaths().isEmpty()
                ? Arrays.asList(ticket.getImagePaths().split(","))
                : List.of();

        List<CommentResponse> comments = commentRepo.findByTicketIdOrderByCreatedAtAsc(ticket.getId())
                .stream()
                .map(this::toCommentDto)
                .collect(Collectors.toList());

        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .location(ticket.getLocation())
                .reporterUsername(ticket.getReporterUsername())
                .assignedTo(ticket.getAssignedTo())
                .status(ticket.getStatus())
                .preferredContact(ticket.getPreferredContact())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .imageUrls(images)
                .comments(comments)
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private CommentResponse toCommentDto(TicketComment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicketId())
                .authorUsername(comment.getAuthorUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}