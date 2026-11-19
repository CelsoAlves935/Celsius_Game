package com.gametracker.api.service;

import com.gametracker.api.dto.GameRequestDTO;
import com.gametracker.api.dto.GameResponseDTO;
import com.gametracker.api.entity.Game;
import com.gametracker.api.entity.GameStatus;
import com.gametracker.api.repository.GameRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public List<GameResponseDTO> findAll(GameStatus status) {
        List<Game> games = (status != null)
                ? gameRepository.findByStatus(status)
                : gameRepository.findAll();

        return games.stream()
                .map(GameResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public GameResponseDTO findById(UUID id) {
        Game game = findEntityById(id);
        return GameResponseDTO.fromEntity(game);
    }

    @Transactional
    public GameResponseDTO create(GameRequestDTO dto) {
        Game game = Game.builder()
                .title(dto.title())
                .platform(dto.platform())
                .status(dto.status())
                .rating(dto.rating())
                .hoursPlayed(dto.hoursPlayed() != null ? dto.hoursPlayed() : 0)
                .coverUrl(dto.coverUrl())
                .review(dto.review())
                .isCurrent(Boolean.TRUE.equals(dto.isCurrent()))
                .build();

        Game saved = gameRepository.save(game);
        return GameResponseDTO.fromEntity(saved);
    }

    @Transactional
    public GameResponseDTO update(UUID id, GameRequestDTO dto) {
        Game game = findEntityById(id);

        game.setTitle(dto.title());
        game.setPlatform(dto.platform());
        game.setStatus(dto.status());
        game.setRating(dto.rating());
        game.setHoursPlayed(dto.hoursPlayed() != null ? dto.hoursPlayed() : 0);
        game.setCoverUrl(dto.coverUrl());
        game.setReview(dto.review());
        if (dto.isCurrent() != null) {
            game.setIsCurrent(dto.isCurrent());
        }

        Game updated = gameRepository.save(game);
        return GameResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void delete(UUID id) {
        Game game = findEntityById(id);
        gameRepository.delete(game);
    }

    private Game findEntityById(UUID id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado"));
    }
}

