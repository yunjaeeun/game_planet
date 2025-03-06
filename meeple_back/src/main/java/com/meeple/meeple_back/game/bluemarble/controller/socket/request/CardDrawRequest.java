package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CardDrawRequest {

	@JsonProperty("playerId")
	private int playerId;
	@JsonProperty("tileId")
	private int tileId;

	@JsonCreator
	@Builder
	public static CardDrawRequest from(@JsonProperty("playerId") int playerId,
			@JsonProperty("tileId") int tileId) {
		return CardDrawRequest.builder().playerId(playerId).tileId(tileId).build();
	}
}
