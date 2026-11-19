package com.gametracker.api.repository;

import com.gametracker.api.entity.Game;
import com.gametracker.api.entity.GameStatus;
import com.gametracker.api.entity.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {

    List<Game> findByStatus(GameStatus status);

    List<Game> findByPlatform(Platform platform);
}

