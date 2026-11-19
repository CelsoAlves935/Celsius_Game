package com.gametracker.api.dto;

import com.gametracker.api.entity.GameStatus;
import com.gametracker.api.entity.Platform;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record GameRequestDTO(
    @NotBlank(message = "O título do jogo é obrigatório")
    @Size(max = 150, message = "O título não pode exceder 150 caracteres")
    String title,

    @NotNull(message = "A plataforma é obrigatória")
    Platform platform,

    @NotNull(message = "O status do jogo é obrigatório")
    GameStatus status,

    @DecimalMin(value = "0.0", message = "A nota mínima é 0.0")
    @DecimalMax(value = "10.0", message = "A nota máxima é 10.0")
    BigDecimal rating,

    @Min(value = 0, message = "As horas jogadas não podem ser negativas")
    Integer hoursPlayed,

    @Size(max = 500, message = "A URL da imagem não pode exceder 500 caracteres")
    String coverUrl,

    String review,

    Boolean isCurrent
) {}

