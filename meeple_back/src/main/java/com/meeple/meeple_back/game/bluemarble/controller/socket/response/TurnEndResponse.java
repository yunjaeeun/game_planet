package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
@Builder
@Data
public class TurnEndResponse {

	private final boolean turnEnd;
	private final Player winner;
	private final Player removedPlayer;
	private final Player nextPlayer;
	private final int currentPlayerIndex;
	private final int round;
	private final String nextAction;

	private TurnEndResponse(boolean turnEnd, Player winner, Player removedPlayer, Player nextPlayer,
			int turnCount, int round, String nextAction) {
		this.turnEnd = turnEnd;
		this.winner = winner;
		this.removedPlayer = removedPlayer;
		this.nextPlayer = nextPlayer;
		this.currentPlayerIndex = turnCount;
		this.round = round;
		this.nextAction = nextAction;
	}

	public static TurnEndResponse gameEnd(Player winner) {
		return new TurnEndResponse(true, winner, null, null, 0, 0, ActionType.GAME_END.getAction());
	}

	public static TurnEndResponse nextTurn(Player removedPlayer, Player currentPlayer,
			int turnCount, int round, ActionType nextAction) {
		return new TurnEndResponse(false, null, removedPlayer, currentPlayer, turnCount, round,
				nextAction.getAction());
	}

	public static TurnEndResponse diceDoubleOneMoreTurn(Player currentPlayer, int turnCount,
			int round) {
		return new TurnEndResponse(false, null, null, currentPlayer, turnCount, round,
				ActionType.START_TURN.getAction());
	}
}
