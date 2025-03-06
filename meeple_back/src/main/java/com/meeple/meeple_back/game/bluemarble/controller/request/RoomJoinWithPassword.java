package com.meeple.meeple_back.game.bluemarble.controller.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomJoinWithPassword {

	@JsonProperty("password")
	private final String password;

	@JsonCreator
	public RoomJoinWithPassword(
			@JsonProperty("password") String password) {
		this.password = password;
	}
}

