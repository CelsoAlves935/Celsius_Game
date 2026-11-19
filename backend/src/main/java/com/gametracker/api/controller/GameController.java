package com.gametracker.api.controller;

import com.gametracker.api.dto.GameRequestDTO;
import com.gametracker.api.dto.GameResponseDTO;
import com.gametracker.api.entity.GameStatus;
import com.gametracker.api.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ResponseEntity<List<GameResponseDTO>> findAll(
            @RequestParam(required = false) GameStatus status
    ) {
        return ResponseEntity.ok(gameService.findAll(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(gameService.findById(id));
    }

    @PostMapping
    public ResponseEntity<GameResponseDTO> create(@Valid @RequestBody GameRequestDTO dto) {
        GameResponseDTO created = gameService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody GameRequestDTO dto
    ) {
        return ResponseEntity.ok(gameService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        gameService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

