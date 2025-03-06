package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DiceRollBroadcastRequest {

	private int playerId;
	private boolean diceRolled;

	@JsonCreator
	public DiceRollBroadcastRequest(@JsonProperty("playerId") int playerId,
			@JsonProperty("diceRolled") boolean diceRolled) {
		this.playerId = playerId;
		this.diceRolled = diceRolled;
	}
}
