package com.meeple.meeple_back.game.repo;

import com.meeple.meeple_back.game.game.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameResultRepository extends JpaRepository<GameResult, Integer> {

}
