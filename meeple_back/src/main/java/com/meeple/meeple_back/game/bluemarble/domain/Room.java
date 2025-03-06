package com.meeple.meeple_back.game.bluemarble.domain;

import com.meeple.meeple_back.common.domain.exception.ResourceNotFoundException;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("Room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

	@Id
	private int roomId;

	@NotBlank(message = "Room name is mandatory")
	private String roomName;

	private LocalDateTime createTime;

	private boolean isPrivate;

	private String password;

	private boolean isGameStart;

	private Player creator;

	private int maxPlayers;

	private List<Player> players;


	public Room update(RoomUpdate roomUpdate) {
		return Room.builder()
				.roomId(roomId)
				.roomName(roomUpdate.getRoomName())
				.createTime(createTime)
				.isPrivate(roomUpdate.isPrivate())
				.password(password)
				.isGameStart(roomUpdate.isGameStart())
				.creator(creator)
				.maxPlayers(roomUpdate.getMaxPlayers())
				.players(players)
				.build();
	}

	public Room addPlayer(Player player) {
		if (Objects.isNull(players)) {
			throw new ResourceNotFoundException("Player", player.getPlayerId());
		}
		if (isFull()) {
			throw new ResourceNotFoundException("Room", roomId);
		}
		if (players.contains(player)) {
			throw new IllegalArgumentException("Player already exists in the room");
		}
		players.add(player);
		return this;
	}

	public boolean isCreator(int userId) {
		return creator.getPlayerId() == userId;
	}

	private boolean isFull() {
		return players.size() >= maxPlayers;
	}


	public Optional<Player> removePlayer(int playerId) {
		Iterator<Player> iterator = players.iterator();
		while (iterator.hasNext()) {
			Player player = iterator.next();
			if (player.getPlayerId() == playerId) {
				iterator.remove();
				return Optional.of(player);
			}
		}
		return Optional.empty();
	}


	public void changeCreator() {
		if (players.isEmpty()) {
			throw new ResourceNotFoundException("Room", roomId);
		}
		creator = players.get(0);
	}


	public boolean isPlayerNotExists() {
		return players.isEmpty();
	}

	public void changePassword(String newPassword) {
		this.password = newPassword;
	}


}
