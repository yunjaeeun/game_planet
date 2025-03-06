package com.meeple.meeple_back.game.bluemarble.controller.response;

import com.meeple.meeple_back.game.bluemarble.domain.Player;
import com.meeple.meeple_back.game.bluemarble.domain.Room;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomResponse {

	private int roomId;
	private String roomName;
	private LocalDateTime createTime;
	private boolean isPrivate;
	private boolean isGameStart;
	private Player creator;
	private int maxPlayers;
	private List<Player> players;

	public static RoomResponse from(Room room) {
		return RoomResponse.builder()
				.roomId(room.getRoomId())
				.roomName(room.getRoomName())
				.createTime(room.getCreateTime())
				.isPrivate(room.isPrivate())
				.isGameStart(room.isGameStart())
				.creator(room.getCreator())
				.maxPlayers(room.getMaxPlayers())
				.players(room.getPlayers())
				.build();
	}
}
