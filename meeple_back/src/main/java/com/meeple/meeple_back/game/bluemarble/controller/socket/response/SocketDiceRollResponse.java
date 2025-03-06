package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.controller.response.DiceRollResponse;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
@Builder
@Data
public class SocketDiceRollResponse {

	private String type;
	private DiceRollResponse diceRollResponse;
	private String message;

	public static SocketDiceRollResponse from(String type, DiceRollResponse diceRollResponse,
	                                          String message) {
		return SocketDiceRollResponse.builder()
				.type(type)
				.diceRollResponse(diceRollResponse)
				.message(message)
				.build();
	}
}
