package com.gametracker.api.config;

import com.gametracker.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@Configuration
public class AdminInitializerConfig {

    private static final UUID DEFAULT_ADMIN_ID =
            UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    @Value("${api.security.admin.username:}")
    private String adminUsername;

    @Value("${api.security.admin.password:}")
    private String adminPassword;

    @Bean
    public CommandLineRunner syncAdminCredentials(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (adminUsername.isBlank() || adminPassword.isBlank()) {
                return;
            }

            userRepository.findById(DEFAULT_ADMIN_ID).ifPresent(admin -> {
                boolean usernameChanged = !admin.getUsername().equals(adminUsername.trim());
                boolean passwordChanged = !passwordEncoder.matches(adminPassword, admin.getPassword());

                if (usernameChanged || passwordChanged) {
                    admin.setUsername(adminUsername.trim());
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    userRepository.save(admin);
                }
            });
        };
    }
}
