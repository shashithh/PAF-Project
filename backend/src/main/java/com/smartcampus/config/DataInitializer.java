package com.smartcampus.config;

import com.smartcampus.entity.Resource;
import com.smartcampus.entity.User;
import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Component @RequiredArgsConstructor @Slf4j
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepo;
    private final ResourceRepository resourceRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByUsername("admin")) {
            userRepo.save(User.builder().username("admin").email("admin@smartcampus.lk")
                    .password(encoder.encode("admin123")).fullName("System Administrator")
                    .roles(Set.of("ROLE_ADMIN", "ROLE_USER")).enabled(true).build());
            log.info("Admin user created: admin / admin123");
        }
        if (!userRepo.existsByUsername("john")) {
            userRepo.save(User.builder().username("john").email("john@smartcampus.lk")
                    .password(encoder.encode("user123")).fullName("John Perera")
                    .roles(Set.of("ROLE_USER")).enabled(true).build());
        }
        if (!userRepo.existsByUsername("tech1")) {
            userRepo.save(User.builder().username("tech1").email("tech1@smartcampus.lk")
                    .password(encoder.encode("tech123")).fullName("Technician Bandara")
                    .roles(Set.of("ROLE_TECHNICIAN", "ROLE_USER")).enabled(true).build());
        }
        if (resourceRepo.count() == 0) {
            resourceRepo.saveAll(List.of(
                Resource.builder().name("Main Lecture Hall A101").type(ResourceType.LECTURE_HALL).description("Large lecture hall with projector, AC, and 200 seats").capacity(200).location("Block A, Ground Floor").building("Block A").floorNumber(0).availableFrom(LocalTime.of(7,0)).availableTo(LocalTime.of(21,0)).status(ResourceStatus.ACTIVE).amenities("Projector, Whiteboard, AC, WiFi, Microphone").build(),
                Resource.builder().name("Computer Lab B201").type(ResourceType.LAB).description("Fully equipped computer lab with 40 workstations").capacity(40).location("Block B, 2nd Floor").building("Block B").floorNumber(2).availableFrom(LocalTime.of(8,0)).availableTo(LocalTime.of(20,0)).status(ResourceStatus.ACTIVE).amenities("40 PCs, Projector, AC, WiFi, Printer").build(),
                Resource.builder().name("Conference Room C301").type(ResourceType.MEETING_ROOM).description("Executive conference room for meetings and presentations").capacity(20).location("Block C, 3rd Floor").building("Block C").floorNumber(3).availableFrom(LocalTime.of(8,0)).availableTo(LocalTime.of(18,0)).status(ResourceStatus.ACTIVE).amenities("Projector, Whiteboard, Video Conferencing, AC").build(),
                Resource.builder().name("Sony Projector #1").type(ResourceType.EQUIPMENT).description("High-resolution Sony projector for portable use").capacity(null).location("Equipment Store, Block D").building("Block D").floorNumber(0).status(ResourceStatus.ACTIVE).amenities("HDMI, VGA, Remote Control").build(),
                Resource.builder().name("Main Auditorium").type(ResourceType.AUDITORIUM).description("University main auditorium for large events").capacity(500).location("Central Block, Ground Floor").building("Central Block").floorNumber(0).availableFrom(LocalTime.of(8,0)).availableTo(LocalTime.of(22,0)).status(ResourceStatus.ACTIVE).amenities("Stage, Sound System, AC, Projector, WiFi").build(),
                Resource.builder().name("Study Room D101").type(ResourceType.STUDY_ROOM).description("Quiet study room for small groups").capacity(10).location("Block D, 1st Floor").building("Block D").floorNumber(1).availableFrom(LocalTime.of(7,0)).availableTo(LocalTime.of(22,0)).status(ResourceStatus.ACTIVE).amenities("Whiteboard, WiFi, AC").build(),
                Resource.builder().name("Physics Lab A301").type(ResourceType.LAB).description("Physics laboratory for experiments and practicals").capacity(30).location("Block A, 3rd Floor").building("Block A").floorNumber(3).availableFrom(LocalTime.of(8,0)).availableTo(LocalTime.of(17,0)).status(ResourceStatus.ACTIVE).amenities("Lab Equipment, Safety Gear, AC").build(),
                Resource.builder().name("Canon DSLR Camera Kit").type(ResourceType.EQUIPMENT).description("Canon EOS 90D DSLR Camera with lenses").capacity(null).location("Media Center, Block E").building("Block E").floorNumber(0).status(ResourceStatus.OUT_OF_SERVICE).amenities("50mm lens, 18-135mm lens, Tripod, Bag").build()
            ));
            log.info("Sample resources created");
        }
    }
}
