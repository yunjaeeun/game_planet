package com.meeple.meeple_back.game.bluemarble.controller.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.DiceRollResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DiceRollResponse {

	private final int playerId;
	private final int prevPosition;

	private final int nextPosition;
	private final int firstDice;
	private final int secondDice;
	private final boolean isDouble;
	private final String nextAction;

	public static DiceRollResponse from(DiceRollResult diceRollResult, ActionType nextAction) {
		return DiceRollResponse.builder()
				.playerId(diceRollResult.getPlayerId())
				.prevPosition(diceRollResult.getPrevPosition())
				.nextPosition(diceRollResult.getNextPosition())
				.isDouble(diceRollResult.isDouble())
				.nextAction(nextAction.name())
				.firstDice(diceRollResult.getFirstDice()).secondDice(diceRollResult.getSecondDice())
				.build();
	}
}
