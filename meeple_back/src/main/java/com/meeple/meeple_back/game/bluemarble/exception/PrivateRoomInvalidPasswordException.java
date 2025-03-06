package com.meeple.meeple_back.game.bluemarble.exception;

public class PrivateRoomInvalidPasswordException extends RuntimeException {
	private int roomId;

	public PrivateRoomInvalidPasswordException(String message, int roomId) {
		super(message);
		this.roomId = roomId;
	}

	public int getRoomId() {
		return roomId;
	}
}
