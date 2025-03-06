package com.meeple.meeple_back.game.bluemarble.domain;

import com.meeple.meeple_back.game.bluemarble.controller.request.DiceRollRequest;
import com.meeple.meeple_back.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Slf4j
public class Player {

	private int playerId;
	private String playerName;
	private int position;
	private int balance;
	private Set<Card> cardOwned = new HashSet<>();
	private List<Integer> landOwned = new ArrayList<>();


	public static Player init(User user) {
		final int INITIAL_BALANCE = 50000000;
		final int INITIAL_POSITION = 0;
		return Player.builder()
				.playerId(Math.toIntExact(user.getUserId()))
				.playerName(user.getUserName())
				.position(INITIAL_POSITION)
				.balance(INITIAL_BALANCE)
				.cardOwned(new HashSet<>())
				.landOwned(new ArrayList<>())
				.build();
	}

	public DiceRollResult rollDices(DiceRollRequest diceRollRequest) {
		int sum = diceRollRequest.getFirstDice() + diceRollRequest.getSecondDice();
		boolean isDouble = diceRollRequest.getFirstDice() == diceRollRequest.getSecondDice();

		int prevPosition = this.position;
		int nextPosition = (this.position + sum) % 40;
		if (this.position + sum >= 40) {
			this.balance += 200;
		}
		this.position = nextPosition;
		return new DiceRollResult(this.playerId, prevPosition, nextPosition, isDouble,
				diceRollRequest.getFirstDice(),
				diceRollRequest.getSecondDice());
	}

	public void payMoney(int price) {
		if (this.balance < price) {
			throw new IllegalArgumentException("Not enough money");
		}
		this.balance -= price;
	}

	public void addLandOwned(int tileId) {
		this.landOwned.add(tileId);
	}

	public void addCardOwned(Card card) {
		this.cardOwned.add(card);
	}

	public void addMoney(int toll) {
		this.balance += toll;
	}


	public SeedCertificateCard getCardOwnedByTileId(int tileId) {
		return (SeedCertificateCard) cardOwned.stream()
				.filter(card -> card.getNumber() == tileId
						&& card.getType() == CardType.SEED_CERTIFICATE_CARD)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Card not found"));
	}

	/**
	 * 파산 여부를 반환한다. 증서, 우주기지, 보유한 현금의 합
	 *
	 * @return 자산이 0보다 작으면 파산
	 */
	public boolean isBankrupt() {
		return this.balance < 0;
	}


	public long calculateTotalAsset(List<Tile> board) {
		long balance = this.balance;
		long landValue = landOwned.stream()
				.mapToLong(tileId -> {
					Tile tile = board.get(tileId);
					long basePrice = tile.isHasBase() ? getCardOwnedByTileId(
							tileId).getBaseConstructionCost() : 0;
					return tile.getPrice() + basePrice;
				})
				.sum();
		return balance + landValue;
	}

	public void setBroken() {
		this.balance = -1;
	}
}