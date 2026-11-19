package com.gametracker.api.dto;

import com.gametracker.api.entity.Game;
import com.gametracker.api.entity.GameStatus;
import com.gametracker.api.entity.Platform;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record GameResponseDTO(
    UUID id,
    String title,
    Platform platform,
    GameStatus status,
    BigDecimal rating,
    Integer hoursPlayed,
    String coverUrl,
    String review,
    Boolean isCurrent,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static GameResponseDTO fromEntity(Game game) {
        return new GameResponseDTO(
            game.getId(),
            game.getTitle(),
            game.getPlatform(),
            game.getStatus(),
            game.getRating(),
            game.getHoursPlayed(),
            game.getCoverUrl(),
            game.getReview(),
            game.getIsCurrent(),
            game.getCreatedAt(),
            game.getUpdatedAt()
        );
    }
}

