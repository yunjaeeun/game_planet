package com.meeple.meeple_back.game.bluemarble.domain;

import lombok.Getter;

@Getter
public enum GameStatus {
	IN_PROGRESS("IN_PROGRESS"),
	FINISHED("FINISHED"),
	READY("READY");

	private final String status;

	GameStatus(String status) {
		this.status = status;
	}
}