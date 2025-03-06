package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TurnEndRequest {
	private int playerId;

	@JsonCreator
	public TurnEndRequest(@JsonProperty("playerId") int playerId) {
		this.playerId = playerId;
	}
}
