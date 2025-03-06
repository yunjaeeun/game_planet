package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_card")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer cardId;

	private Integer cardNumber;

	@Column(length = 30)
	private String cardName;

	@Column(length = 500)
	private String cardDescription;

	@Column(length = 30)
	private String cardType;

	@Column(length = 20)
	private String cardColor;

	private Integer cardSeedCount;

	private Integer cardBaseConstructionCost;

	private Integer cardHeadquartersUsageFee;

	private Integer cardBaseUsageFee;
}