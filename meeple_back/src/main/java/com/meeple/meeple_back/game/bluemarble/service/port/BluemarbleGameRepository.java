package com.meeple.meeple_back.game.bluemarble.service.port;

import com.meeple.meeple_back.game.bluemarble.domain.GamePlay;
import java.util.Optional;

public interface BluemarbleGameRepository {

	GamePlay save(GamePlay gamePlay);

	Optional<GamePlay> findById(Integer roomId);
}
