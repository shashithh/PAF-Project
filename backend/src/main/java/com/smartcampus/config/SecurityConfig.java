package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Module B security configuration — intentionally permissive.
 *
 * All /api/** endpoints are open (no authentication required) so the
 * booking flow works with the mock user switcher in the frontend.
 *
 * MERGE NOTE:
 *   When Module A is merged, DELETE this file entirely.
 *   Module A's SecurityConfig (com.smartcampus.facilities.security.SecurityConfig)
 *   will take over and enforce HTTP Basic Auth on all endpoints.
 *   At that point the frontend login page (Module A) handles authentication,
 *   and the Authorization header is forwarded to all API calls including bookings.
 *
 *   The only change needed in Module A's SecurityConfig after merge is to
 *   add "http://localhost:5173" to the allowed CORS origins list.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)   // CorsConfig (WebMvcConfigurer) handles it
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()            // open — Module A will restrict after merge
            )
            .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        return http.build();
    }
}
