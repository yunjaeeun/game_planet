package com.meeple.meeple_back.game.bluemarble.controller.response;

import com.meeple.meeple_back.game.bluemarble.domain.*;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Builder
@Getter
@ToString
public class GamePlayResponse {


	private int gamePlayId;
	private int currentPlayerIndex;
	private List<Player> players;
	private String gameStatus;
	private int round;
	private List<Tile> board;
	private List<Card> cards;
	private String nextAction;
	private boolean doubleState;


	public static GamePlayResponse from(GamePlay gamePlay, ActionType actionType) {
		return GamePlayResponse.builder()
				.gamePlayId(gamePlay.getGamePlayId())
				.currentPlayerIndex(gamePlay.getTurnManager().getCurrentPlayerIndex())
				.players(gamePlay.getPlayers())
				.gameStatus(gamePlay.getGameStatus())
				.round(gamePlay.getRound())
				.board(gamePlay.getBoard())
				.cards(gamePlay.getCards())
				.nextAction(actionType.name())
				.doubleState(gamePlay.getTurnManager().checkDoubleState())
				.build();
	}
}
