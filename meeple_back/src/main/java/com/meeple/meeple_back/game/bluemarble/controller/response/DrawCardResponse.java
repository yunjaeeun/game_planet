package com.meeple.meeple_back.game.bluemarble.controller.response;

import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.Card;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DrawCardResponse {

	private int playerId;
	private Card pickedCard;
	private Player player;
	private List<Card> cards;
	private String nextAction;

	public static DrawCardResponse from(int playerId, Player player, Card card,
			ActionType nextAction, List<Card> cards) {
		return DrawCardResponse.builder()
				.playerId(playerId)
				.pickedCard(card)
				.player(player)
				.cards(cards)
				.nextAction(nextAction.name())
				.build();
	}
}
