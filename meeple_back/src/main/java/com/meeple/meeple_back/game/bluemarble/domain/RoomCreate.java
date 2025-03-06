package com.meeple.meeple_back.game.bluemarble.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;


@Builder
public class RoomCreate {

	@JsonProperty("roomName")
	public String getRoomName() {
		return roomName;
	}

	@JsonProperty("isPrivate")
	public boolean isPrivate() {
		return isPrivate;
	}

	@JsonProperty("password")
	public String getPassword() {
		return password;
	}

	@JsonProperty("maxPlayers")
	public int getMaxPlayers() {
		return maxPlayers;
	}

	@NotBlank(message = "Room name is mandatory")
	private String roomName;
	@JsonProperty("isPrivate")
	private boolean isPrivate;
	@JsonProperty("password")
	private String password;
	@Min(value = 2, message = "최소 2명의 플레이어가 필요합니다.")
	private int maxPlayers;

	@JsonCreator
	public RoomCreate(@JsonProperty("roomName") String roomName,
			@JsonProperty("isPrivate") boolean isPrivate,
			@JsonProperty("password") String password,
			@JsonProperty("maxPlayers") int maxPlayers) {
		this.roomName = roomName;
		this.isPrivate = isPrivate;
		this.password = password;
		this.maxPlayers = maxPlayers;
	}
}
