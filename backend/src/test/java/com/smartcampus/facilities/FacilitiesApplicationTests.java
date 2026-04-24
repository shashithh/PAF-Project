package com.smartcampus.facilities;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Basic Spring Boot context load test.
 * Verifies the application context starts without errors.
 *
 * Run with: mvn test
 */
@SpringBootTest
@ActiveProfiles("test")
class FacilitiesApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, the Spring context loaded successfully.
        // All beans were wired correctly with no configuration errors.
    }
}
