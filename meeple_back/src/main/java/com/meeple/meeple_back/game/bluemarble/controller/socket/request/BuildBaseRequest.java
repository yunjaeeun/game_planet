package com.meeple.meeple_back.game.bluemarble.controller.socket.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class BuildBaseRequest {

	@JsonProperty("playerId")
	private int playerId;
	@JsonProperty("tileId")
	private int tileId;

	@JsonCreator
	public static BuildBaseRequest from(@JsonProperty("playerId") int playerId,
			@JsonProperty("tileId") int tileId) {
		return BuildBaseRequest.builder().playerId(playerId).tileId(tileId).build();
	}
}
