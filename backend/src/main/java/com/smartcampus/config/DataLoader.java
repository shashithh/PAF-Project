package com.smartcampus.config;

import com.smartcampus.booking.Booking;
import com.smartcampus.booking.BookingRepository;
import com.smartcampus.booking.BookingStatus;
import com.smartcampus.resource.Resource;
import com.smartcampus.resource.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Seeds MongoDB with resources and sample bookings on first startup.
 * Skips seeding if documents already exist (idempotent).
 */
@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedDatabase(BookingRepository bookingRepo,
                                   ResourceRepository resourceRepo) {
        return args -> {
            // ── Seed resources ────────────────────────────────────
            if (resourceRepo.count() == 0) {
                resourceRepo.save(resource("r1", "Computer Lab A",      30, "lab"));
                resourceRepo.save(resource("r2", "Computer Lab B",      30, "lab"));
                resourceRepo.save(resource("r3", "Conference Room 101", 12, "room"));
                resourceRepo.save(resource("r4", "Physics Lab",         20, "lab"));
                resourceRepo.save(resource("r5", "Projector Kit #3",     1, "equipment"));
                System.out.println("Seeded 5 resources into MongoDB.");
            }

            // ── Seed bookings ─────────────────────────────────────
            if (bookingRepo.count() == 0) {
                bookingRepo.save(booking("u1","Alice Tan",  "r1","Computer Lab A",      "2026-04-20","09:00","11:00","Final year project - frontend integration sprint",  BookingStatus.APPROVED,  "2026-04-15T08:30:00"));
                bookingRepo.save(booking("u1","Alice Tan",  "r3","Conference Room 101", "2026-04-22","14:00","15:30","Capstone project team sync - milestone review",       BookingStatus.PENDING,   "2026-04-16T10:00:00"));
                bookingRepo.save(booking("u1","Alice Tan",  "r5","Projector Kit #3",    "2026-04-25","10:00","12:00","Presentation rehearsal for CS401 demo day",           BookingStatus.PENDING,   "2026-04-17T09:15:00"));
                bookingRepo.save(booking("u1","Alice Tan",  "r2","Computer Lab B",      "2026-04-10","13:00","15:00","Database assignment - group session",                 BookingStatus.APPROVED,  "2026-04-07T11:00:00"));
                bookingRepo.save(booking("u1","Alice Tan",  "r4","Physics Lab",         "2026-04-08","08:00","10:00","Lab report experiment - optics module",               BookingStatus.CANCELLED, "2026-04-05T14:20:00"));
                bookingRepo.save(booking("u1","Alice Tan",  "r3","Conference Room 101", "2026-04-28","16:00","17:00","Mock interview practice with career advisor",         BookingStatus.APPROVED,  "2026-04-18T08:00:00"));
                bookingRepo.save(booking("u2","Bob Lim",    "r2","Computer Lab B",      "2026-04-22","10:00","12:00","Data structures lab - binary tree implementation",    BookingStatus.REJECTED,  "2026-04-14T09:00:00"));
                bookingRepo.save(booking("u2","Bob Lim",    "r1","Computer Lab A",      "2026-04-23","14:00","16:00","Machine learning assignment - model training",        BookingStatus.PENDING,   "2026-04-17T15:30:00"));
                bookingRepo.save(booking("u2","Bob Lim",    "r4","Physics Lab",         "2026-04-11","09:00","11:30","Electromagnetic induction experiment",                BookingStatus.APPROVED,  "2026-04-08T10:00:00"));
                bookingRepo.save(booking("u2","Bob Lim",    "r5","Projector Kit #3",    "2026-04-30","11:00","12:00","Club recruitment presentation - Robotics Society",    BookingStatus.PENDING,   "2026-04-18T11:45:00"));
                bookingRepo.save(booking("u3","Carol Ng",   "r3","Conference Room 101", "2026-04-21","09:00","10:00","Study group - Advanced Algorithms revision",          BookingStatus.APPROVED,  "2026-04-15T13:00:00"));
                bookingRepo.save(booking("u3","Carol Ng",   "r1","Computer Lab A",      "2026-04-24","15:00","17:00","Web development project - React component testing",   BookingStatus.PENDING,   "2026-04-18T09:30:00"));
                bookingRepo.save(booking("u3","Carol Ng",   "r2","Computer Lab B",      "2026-04-09","10:00","11:00","Operating systems tutorial - process scheduling",     BookingStatus.APPROVED,  "2026-04-06T08:00:00"));
                bookingRepo.save(booking("u3","Carol Ng",   "r4","Physics Lab",         "2026-04-29","13:00","15:00","Thermodynamics experiment - heat transfer lab",       BookingStatus.REJECTED,  "2026-04-17T16:00:00"));
                bookingRepo.save(booking("u4","David Koh",  "r5","Projector Kit #3",    "2026-04-21","13:00","14:00","Entrepreneurship pitch deck - startup competition",   BookingStatus.APPROVED,  "2026-04-14T12:00:00"));
                bookingRepo.save(booking("u4","David Koh",  "r3","Conference Room 101", "2026-04-26","10:00","11:30","Internship interview preparation - mock session",     BookingStatus.PENDING,   "2026-04-18T14:00:00"));
                bookingRepo.save(booking("u4","David Koh",  "r1","Computer Lab A",      "2026-04-07","11:00","13:00","Network security assignment - packet analysis",       BookingStatus.CANCELLED, "2026-04-04T09:00:00"));
                bookingRepo.save(booking("u4","David Koh",  "r2","Computer Lab B",      "2026-05-02","09:00","11:00","Final exam revision - compiler design",               BookingStatus.PENDING,   "2026-04-18T16:30:00"));
                System.out.println("Seeded 18 bookings into MongoDB.");
            }
        };
    }

    private Resource resource(String id, String name, int capacity, String type) {
        Resource r = new Resource();
        r.setId(id);
        r.setName(name);
        r.setCapacity(capacity);
        r.setType(type);
        return r;
    }

    private Booking booking(String userId, String userName,
                            String resourceId, String resourceName,
                            String date, String start, String end,
                            String purpose, BookingStatus status, String createdAt) {
        Booking b = new Booking();
        b.setUserId(userId);
        b.setUserName(userName);
        b.setResourceId(resourceId);
        b.setResourceName(resourceName);
        b.setDate(LocalDate.parse(date));
        b.setStartTime(LocalTime.parse(start));
        b.setEndTime(LocalTime.parse(end));
        b.setPurpose(purpose);
        b.setStatus(status);
        b.setCreatedAt(LocalDateTime.parse(createdAt));
        return b;
    }
}
