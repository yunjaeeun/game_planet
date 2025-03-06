package com.meeple.meeple_back.game.bluemarble.controller.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DiceRollRequest {

	@JsonProperty("playerId")
	private int playerId;
	@JsonProperty("firstDice")
	private int firstDice;
	@JsonProperty("secondDice")
	private int secondDice;

	@JsonCreator
	public DiceRollRequest(@JsonProperty("playerId") int playerId,
			@JsonProperty("firstDice") int firstDice, @JsonProperty("secondDice") int secondDice) {
		this.playerId = playerId;
		this.firstDice = firstDice;
		this.secondDice = secondDice;
	}
}
