package com.meeple.meeple_back.game.bluemarble.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

public class RoomUpdate {

	@NotBlank(message = "Room name is mandatory")
	@Schema(
			name = "roomName",
			description = "방 이름",
			example = "My Awesome Room"
	)
	private final String roomName;

	@JsonProperty("isPrivate")
	@Schema(
			name = "isPrivate",
			description = "비공개 여부 (true: 비공개, false: 공개)",
			example = "true"
	)
	private final boolean isPrivate;

	@JsonProperty("isGameStart")
	@Schema(
			name = "isGameStart",
			description = "게임 시작 여부 (true: 시작됨, false: 아직 시작 전)",
			example = "false"
	)
	private final boolean isGameStart;

	@Min(value = 1, message = "플레이어는 최소 1명 이상이 필요합니다.")
	@Schema(
			name = "maxPlayers",
			description = "최대 플레이어 수 (1 이상)",
			example = "4"
	)
	private final int maxPlayers;

	@Builder
	@JsonCreator
	public RoomUpdate(
			@JsonProperty("roomName") String roomName,
			@JsonProperty("isPrivate") boolean isPrivate,
			@JsonProperty("isGameStart") boolean isGameStart,
			@JsonProperty("maxPlayers") int maxPlayers
	) {
		this.roomName = roomName;
		this.isPrivate = isPrivate;
		this.isGameStart = isGameStart;
		this.maxPlayers = maxPlayers;
	}

	@JsonProperty("roomName")
	public String getRoomName() {
		return roomName;
	}

	@JsonProperty("isPrivate")
	public boolean isPrivate() {
		return isPrivate;
	}

	@JsonProperty("isGameStart")
	public boolean isGameStart() {
		return isGameStart;
	}

	@JsonProperty("maxPlayers")
	public int getMaxPlayers() {
		return maxPlayers;
	}
}
