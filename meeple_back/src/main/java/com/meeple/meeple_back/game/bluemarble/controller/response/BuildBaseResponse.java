package com.meeple.meeple_back.game.bluemarble.controller.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import com.meeple.meeple_back.game.bluemarble.domain.Tile;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class BuildBaseResponse {

	private int playerId;
	private int prevMoney;
	private int updatedMoney;
	private Player updatedPlayer;
	private Tile updatedTile;
	private String nextAction;

	public static BuildBaseResponse from(int playerId, int prevMoney, int updatedMoney,
			Player updatedPlayer, Tile updatedTile, ActionType nextAction) {
		return BuildBaseResponse.builder()
				.playerId(playerId)
				.prevMoney(prevMoney)
				.updatedMoney(updatedMoney)
				.updatedPlayer(updatedPlayer)
				.updatedTile(updatedTile)
				.nextAction(nextAction.getAction())
				.build();
	}
}
