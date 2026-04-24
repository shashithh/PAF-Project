package com.smartcampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration for Module B (Booking Management).
 *
 * Allowed origins:
 *   - http://localhost:5173  → Module B Vite dev server (our frontend)
 *   - http://localhost:8021  → Module A Vite dev server (facilities frontend)
 *   - http://localhost:3000  → fallback / production build preview
 *
 * MERGE NOTE:
 *   Module A defines its own CORS inside SecurityConfig (CorsConfigurationSource bean).
 *   After merge, Module A's SecurityConfig takes over CORS for the whole app via
 *   Spring Security's filter chain. At that point this WebMvcConfigurer is still
 *   harmless but the SecurityConfig bean is the one that actually applies.
 *   To avoid duplication after merge, update Module A's SecurityConfig to include
 *   all three origins listed here.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",   // Module B frontend (Vite)
                    "http://localhost:8021",   // Module A frontend (Vite)
                    "http://localhost:3000"    // fallback
                )
                .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
