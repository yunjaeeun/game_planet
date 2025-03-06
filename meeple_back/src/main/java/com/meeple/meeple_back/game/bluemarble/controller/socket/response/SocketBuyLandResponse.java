package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.controller.response.BuyLandResponse;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Getter
@Data
public class SocketBuyLandResponse {

	private String type;
	private BuyLandResponse buyLandResponse;

	private String message;

	public static SocketBuyLandResponse from(String type, BuyLandResponse buyLandResponse,
			String message) {
		return SocketBuyLandResponse.builder()
				.type(type)
				.buyLandResponse(buyLandResponse)
				.message(message)
				.build();
	}
}
