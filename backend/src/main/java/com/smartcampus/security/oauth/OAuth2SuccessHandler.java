package com.smartcampus.security.oauth;

import com.smartcampus.entity.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component @RequiredArgsConstructor @Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepo;
    private final JwtUtils jwtUtils;
    @Value("${app.cors.allowed-origins:http://localhost:5173}") private String frontendUrls;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) throws IOException {
        OAuth2User oauthUser = (OAuth2User) auth.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        User user = userRepo.findByEmail(email).orElseGet(() -> {
            String username = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "") + (System.currentTimeMillis() % 1000);
            return userRepo.save(User.builder()
                    .username(username).email(email).fullName(name)
                    .profilePicture(picture).oauthProvider("google")
                    .oauthId(oauthUser.getAttribute("sub"))
                    .roles(Set.of("USER")).enabled(true).build());
        });
        String token = jwtUtils.generateTokenFromUsername(user.getUsername());
        String base = frontendUrls.split(",")[0].trim();
        res.sendRedirect(base + "/oauth2/callback?token=" + token);
    }
}
