package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import lombok.Builder;
import lombok.Getter;

/**
 * 지불 한 다음 변경된 상태 return
 */
@Getter
@Builder
public class PayFeeResponse {

	private int prevMoney;
	private int updatedMoney;
	private int tollPrice;
	private boolean playerBrokenState;
	private Player paidPlayer;
	private Player receivedPlayer;
	private String nextAction;

	public static PayFeeResponse from(int prevMoney, int updatedMoney, int tollPrice,
			boolean playerBrokenState, Player paidPlayer, Player receivedPlayer,
			ActionType nextAction) {
		return PayFeeResponse.builder().prevMoney(prevMoney).updatedMoney(updatedMoney)
				.tollPrice(tollPrice).playerBrokenState(playerBrokenState).paidPlayer(paidPlayer)
				.receivedPlayer(receivedPlayer).nextAction(
						nextAction.name()).build();

	}
}
