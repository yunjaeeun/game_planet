package com.meeple.meeple_back.game.bluemarble.controller.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SocketRoomResponse {

	private String type;
	private RoomResponse roomResponse;
	private String message;

	public static SocketRoomResponse of(RoomResponse roomResponse, String message) {
		return SocketRoomResponse.builder()
				.type("room")
				.message(message)
				.roomResponse(roomResponse)
				.build();
	}
}
