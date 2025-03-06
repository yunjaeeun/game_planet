package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.domain.GamePlay;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SocketGamePlayResponse {

	private String type;
	private GamePlay gamePlay;
	private String message;

	public static SocketGamePlayResponse from(String type, GamePlay gamePlay, String message) {
		return SocketGamePlayResponse.builder()
				.type(type)
				.gamePlay(gamePlay)
				.message(message)
				.build();
	}
}
