package com.meeple.meeple_back.game.bluemarble.service.port;

import com.meeple.meeple_back.game.bluemarble.domain.Room;
import com.meeple.meeple_back.game.bluemarble.infrastructure.RoomEntity;
import java.util.List;
import java.util.Optional;

public interface BluemarbleRoomRepository {

	RoomEntity save(RoomEntity room);

	Room save(Room room);

	Optional<Room> findById(int roomId);

	List<Room> findAll();

	void delete(Room room);

	List<Room> findByRoomName(String searchName);
}
