package com.smartcampus.facilities;

import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@RequiredArgsConstructor
public class FacilitiesApplication {

    public static void main(String[] args) {
        SpringApplication.run(FacilitiesApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("USER").isEmpty()) {
                Role role = new Role();
                role.setName("USER");
                role.setDescription("Regular user with basic access");
                roleRepository.save(role);
            }
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                Role role = new Role();
                role.setName("ADMIN");
                role.setDescription("Administrator with full access");
                roleRepository.save(role);
            }
            if (roleRepository.findByName("TECHNICIAN").isEmpty()) {
                Role role = new Role();
                role.setName("TECHNICIAN");
                role.setDescription("Handles maintenance tickets");
                roleRepository.save(role);
            }
        };
    }
}