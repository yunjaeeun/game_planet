package com.meeple.meeple_back.game.repo;

import com.meeple.meeple_back.game.game.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Integer> {

}
