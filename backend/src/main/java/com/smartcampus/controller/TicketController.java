package com.smartcampus.controller;

import com.smartcampus.dto.request.CommentRequest;
import com.smartcampus.dto.request.TicketRequest;
import com.smartcampus.dto.request.TicketStatusUpdate;
import com.smartcampus.dto.response.ApiResponse;
import com.smartcampus.dto.response.CommentResponse;
import com.smartcampus.dto.response.TicketAnalyticsResponse;
import com.smartcampus.dto.response.TicketResponse;
import com.smartcampus.enums.TicketCategory;
import com.smartcampus.enums.TicketPriority;
import com.smartcampus.enums.TicketStatus;
import com.smartcampus.service.impl.TicketServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class TicketController {

    private final TicketServiceImpl ticketService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> create(
            @Valid @RequestBody TicketRequest req,
            Authentication auth) {
        System.out.println("Ticket create user: " + auth.getName());
        System.out.println("Ticket create authorities: " + auth.getAuthorities());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket created", ticketService.create(req, auth.getName())));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketCategory category,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String reporter,
            Authentication auth) {
        boolean isAdmin = isAdminOrTech(auth);
        System.out.println("Ticket GET /api/tickets - user=" + auth.getName() + " authorities=" + auth.getAuthorities());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Tickets retrieved",
                        ticketService.getTickets(auth.getName(), isAdmin, status, category, priority, reporter)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> getById(
            @PathVariable String id,
            Authentication auth) {
        TicketResponse ticket = ticketService.getById(id);

        if (!isAdminOrTech(auth) && !ticket.getReporterUsername().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied"));
        }

        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved", ticket));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody TicketStatusUpdate req,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Status updated",
                        ticketService.updateStatus(id, req, auth.getName(), isAdmin)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        ticketService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketAnalyticsResponse>> getAnalytics() {
        return ResponseEntity.ok(
                ApiResponse.success("Analytics retrieved", ticketService.getAnalytics()));
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponse>> uploadImages(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files,
            Authentication auth) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Images uploaded",
                        ticketService.uploadImages(id, files, auth.getName())));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Comment added",
                        ticketService.addComment(id, req, auth.getName())));
    }

    @PutMapping("/{id}/comments/{cid}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<CommentResponse>> editComment(
            @PathVariable String id,
            @PathVariable String cid,
            @Valid @RequestBody CommentRequest req,
            Authentication auth) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Comment updated",
                        ticketService.editComment(id, cid, req, auth.getName())));
    }

    @DeleteMapping("/{id}/comments/{cid}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String id,
            @PathVariable String cid,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        ticketService.deleteComment(id, cid, auth.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdminOrTech(Authentication auth) {
        return auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
                || auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_TECHNICIAN"));
    }
}