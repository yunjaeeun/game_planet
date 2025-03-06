package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BuyLandRequest {

	private int playerId;
	private int tileId;

	@JsonCreator
	public BuyLandRequest(@JsonProperty("playerId") int playerId,
			@JsonProperty("tileId") int tileId) {
		this.playerId = playerId;
		this.tileId = tileId;
	}
}

