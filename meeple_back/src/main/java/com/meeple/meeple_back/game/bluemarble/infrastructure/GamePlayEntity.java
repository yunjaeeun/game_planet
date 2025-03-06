package com.meeple.meeple_back.game.bluemarble.infrastructure;


import com.meeple.meeple_back.game.bluemarble.domain.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@RedisHash("GamePlayEntity")
@Getter
@Builder
public class GamePlayEntity {

	@Id
	private int gamePlayId;
	private List<Player> players;
	private String gameStatus;
	private int round;
	private List<Tile> board;
	private List<Card> cards;
	private TurnManager turnManager;


	public GamePlayEntity() {

	}

	@PersistenceConstructor
	public GamePlayEntity(int gamePlayId, List<Player> players,
	                      String gameStatus, int round, List<Tile> board, List<Card> cards,
	                      TurnManager turnManager
	) {
		this.gamePlayId = gamePlayId;
		this.players = players;
		this.gameStatus = gameStatus;
		this.round = round;
		this.board = board;
		this.cards = cards;
		this.turnManager = turnManager;
	}

	public static GamePlayEntity from(GamePlay gamePlay) {
		return new GamePlayEntity(
				gamePlay.getGamePlayId(),
				gamePlay.getPlayers(),
				gamePlay.getGameStatus(),
				gamePlay.getRound(),
				gamePlay.getBoard(),
				gamePlay.getCards(),
				gamePlay.getTurnManager()
		);
	}

	public static GamePlay toGamePlay(GamePlayEntity gamePlayEntity) {
		return GamePlay.builder()
				.gamePlayId(gamePlayEntity.getGamePlayId())
				.players(gamePlayEntity.getPlayers())
				.gameStatus(gamePlayEntity.getGameStatus())
				.round(gamePlayEntity.getRound())
				.board(gamePlayEntity.getBoard())
				.cards(gamePlayEntity.getCards())
				.turnManager(gamePlayEntity.getTurnManager())
				.build();
	}
}
