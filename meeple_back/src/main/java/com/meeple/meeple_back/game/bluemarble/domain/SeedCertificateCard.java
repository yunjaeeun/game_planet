package com.meeple.meeple_back.game.bluemarble.domain;

import lombok.Getter;

@Getter
public final class SeedCertificateCard extends Card {

	private final String cardColor;
	private final int seedCount;
	private final int baseConstructionCost;
	private final int headquartersUsageFee;
	private final int baseUsageFee;

	public SeedCertificateCard(int id, int number, String name, String cardColor, int seedCount,
			String description,
			int baseConstructionCost, int headquartersUsageFee, int baseUsageFee) {
		super(id, number, name, CardType.SEED_CERTIFICATE_CARD, description);
		this.cardColor = cardColor;
		this.seedCount = seedCount;
		this.baseConstructionCost = baseConstructionCost;
		this.headquartersUsageFee = headquartersUsageFee;
		this.baseUsageFee = baseUsageFee;
	}
}
