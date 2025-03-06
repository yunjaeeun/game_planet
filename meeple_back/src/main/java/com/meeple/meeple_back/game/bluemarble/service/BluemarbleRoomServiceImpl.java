package com.meeple.meeple_back.game.bluemarble.service;

import com.meeple.meeple_back.common.domain.exception.ResourceNotFoundException;
import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleRoomService;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomJoinWithPassword;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomUpdatePassword;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import com.meeple.meeple_back.game.bluemarble.domain.Room;
import com.meeple.meeple_back.game.bluemarble.domain.RoomCreate;
import com.meeple.meeple_back.game.bluemarble.domain.RoomUpdate;
import com.meeple.meeple_back.game.bluemarble.exception.PrivateRoomInvalidPasswordException;
import com.meeple.meeple_back.game.bluemarble.infrastructure.RoomEntity;
import com.meeple.meeple_back.game.bluemarble.service.port.BluemarbleRoomRepository;
import com.meeple.meeple_back.game.game.model.Game;
import com.meeple.meeple_back.game.game.model.GameEnum;
import com.meeple.meeple_back.game.repo.GameRepository;
import com.meeple.meeple_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BluemarbleRoomServiceImpl implements BluemarbleRoomService {

	private final BluemarbleRoomRepository bluemarbleRoomRepository;
	private final GameRepository gameRepository;
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;


	@Override
	@Transactional
	public Room create(long userId, RoomCreate roomCreate) {
		Game bluemarble = gameRepository.getReferenceById(GameEnum.BLUEMARBLE.getGameId());
		RoomEntity roomEntity = RoomEntity.builder().roomName(roomCreate.getRoomName()).createTime(
						LocalDateTime.now()).game(bluemarble)
				.build();
		bluemarbleRoomRepository.save(roomEntity);

		Player newPlayer = Player.init(userService.findById(userId));
		List<Player> players = new ArrayList<>();
		players.add(newPlayer);

		Room room = Room.builder().roomId(roomEntity.getRoomId()).roomName(roomEntity.getRoomName())
				.createTime(roomEntity.getCreateTime()).isPrivate(roomCreate.isPrivate())
				.password(passwordEncoder.encode(roomCreate.getPassword())).isGameStart(false)
				.creator(Player.init(userService.findById(userId)))
				.maxPlayers(roomCreate.getMaxPlayers()).players(players).build();
		bluemarbleRoomRepository.save(room);
		return room;
	}


	@Override
	@Transactional
	public Room join(int roomId, long userId) {
		Room room = bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
		room = room.addPlayer(Player.init(userService.findById(userId)));
		bluemarbleRoomRepository.save(room);
		return room;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Room> getList() {
		return bluemarbleRoomRepository.findAll();
	}

	@Override
	public Room delete(int roomId, long currentUserId) {
		Room room = bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
		Player removed = room.removePlayer((int) currentUserId)
				.orElseThrow(() -> new ResourceNotFoundException("Player", currentUserId));
		if (room.isPlayerNotExists()) {
			bluemarbleRoomRepository.delete(room);
			return room;
		}

		if (room.isCreator(removed.getPlayerId())) {
			room.changeCreator();
		}
		return bluemarbleRoomRepository.save(room);
	}

	@Override
	@Transactional
	public Room update(int roomId, RoomUpdate roomUpdate) {
		Room room = bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
		Room updatedRoom = room.update(roomUpdate);
		bluemarbleRoomRepository.save(updatedRoom);
		return updatedRoom;
	}

	@Override
	@Transactional(readOnly = true)
	public Room findById(int roomId) {
		return bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
	}

	@Override
	@Transactional(readOnly = true)
	public List<Room> search(String searchName) {
		return bluemarbleRoomRepository.findByRoomName(searchName);
	}

	@Override
	@Transactional
	public Room changePassword(int roomId, RoomUpdatePassword roomUpdatePassword) {
		Room room = bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));

		room.changePassword(passwordEncoder.encode(roomUpdatePassword.getPassword()));
		bluemarbleRoomRepository.save(room);
		return room;
	}

	@Override
	@Transactional
	public Room joinWithPassword(int roomId, int userId,
	                             RoomJoinWithPassword roomJoinWithPassword) {
		Room room = bluemarbleRoomRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
		boolean isCorrectPassword = passwordEncoder.matches(roomJoinWithPassword.getPassword(),
				room.getPassword());
		if (!isCorrectPassword) {
			throw new PrivateRoomInvalidPasswordException("비밀번호가 일치하지 않습니다.", roomId);
		}
		room = room.addPlayer(
				Player.init(userService.findById(userId)));
		bluemarbleRoomRepository.save(room);
		return room;
	}


}
