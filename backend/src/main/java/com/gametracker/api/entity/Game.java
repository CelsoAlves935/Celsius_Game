package com.gametracker.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Platform platform;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GameStatus status;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "hours_played")
    @Builder.Default
    private Integer hoursPlayed = 0;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private Boolean isCurrent = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

