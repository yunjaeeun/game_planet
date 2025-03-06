package com.meeple.meeple_back.game.bluemarble.controller.socket.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Getter
@Builder
@Data
public class SocketResponse<T> {

	private String type;
	private T data;
	private String message;

	public static <T> SocketResponse<T> from(String type, T data, String message) {
		return SocketResponse.<T>builder()
				.type(type)
				.data(data)
				.message(message)
				.build();
	}
}
