package com.meeple.meeple_back.game.bluemarble.aop.response;

import lombok.Data;

@Data
public class SocketInternalServerError {
	private int roomId;
	private String message;
	private int status;

	public SocketInternalServerError(int roomId, String message, int status) {
		this.roomId = roomId;
		this.message = message;
		this.status = status;
	}
}
