package com.meeple.meeple_back.game.bluemarble.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tile {

	private int id;
	private String name;
	private int ownerId;
	private int tollPrice;
	private boolean hasBase;
	private TileType type;
	private String imageUrl;
	private int price;


	public void update(int ownerId, int tollPrice,
	                   int price) {
		this.ownerId = ownerId;
		this.tollPrice = tollPrice;
		this.price = price;
	}

	public void addBase() {
		this.hasBase = true;
	}

	public void updateTollPrice(int newTollPrice) {
		this.tollPrice = newTollPrice;
	}

	public void initialize() {
		this.ownerId = -1;
		this.tollPrice = 0;
		this.hasBase = false;
	}
}
