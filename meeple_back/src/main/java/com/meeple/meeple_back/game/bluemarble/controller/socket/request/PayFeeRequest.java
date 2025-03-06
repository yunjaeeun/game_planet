package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayFeeRequest {

	@JsonProperty("playerId")
	private int playerId;
	@JsonProperty("tileId")
	private int tileId;

	@JsonCreator
	public PayFeeRequest(@JsonProperty("playerId") int playerId,
			@JsonProperty("tileId") int tileId) {
		this.playerId = playerId;
		this.tileId = tileId;
	}
}
