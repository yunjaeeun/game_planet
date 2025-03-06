package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StartTurnResponse {
	private Player currentPlayer;
	private int round;
	private int turnCount;
	private boolean doubleState;
	private String nextAction;

	public static StartTurnResponse from(Player currentPlayer, int round, int turnCount, boolean doubleState) {
		return StartTurnResponse.builder()
				.currentPlayer(currentPlayer)
				.round(round)
				.turnCount(turnCount)
				.doubleState(doubleState)
				.nextAction(ActionType.ROLL_DICE.getAction())
				.build();
	}
}
