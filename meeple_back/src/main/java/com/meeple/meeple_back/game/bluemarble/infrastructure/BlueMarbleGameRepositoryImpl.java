package com.meeple.meeple_back.game.bluemarble.infrastructure;

import com.meeple.meeple_back.game.bluemarble.domain.GamePlay;
import com.meeple.meeple_back.game.bluemarble.service.port.BluemarbleGameRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class BlueMarbleGameRepositoryImpl implements BluemarbleGameRepository {

	private final BluemarbleGameRedisRepository bluemarbleGameRedisRepository;

	@Override
	public GamePlay save(GamePlay gamePlay) {
		GamePlayEntity gamePlayEntity = GamePlayEntity.from(gamePlay);

		bluemarbleGameRedisRepository.save(gamePlayEntity);
		return GamePlayEntity.toGamePlay(
				gamePlayEntity);
	}

	@Override
	public Optional<GamePlay> findById(Integer playerId) {
		GamePlayEntity gamePlayEntity = bluemarbleGameRedisRepository.findById(playerId)
				.orElseThrow();
		return Optional.ofNullable(GamePlayEntity.toGamePlay(
				gamePlayEntity));
	}
}
