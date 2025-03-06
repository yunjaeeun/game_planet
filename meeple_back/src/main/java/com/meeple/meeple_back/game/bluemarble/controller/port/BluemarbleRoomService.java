package com.meeple.meeple_back.game.bluemarble.controller.port;

import com.meeple.meeple_back.game.bluemarble.controller.request.RoomJoinWithPassword;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomUpdatePassword;
import com.meeple.meeple_back.game.bluemarble.domain.Room;
import com.meeple.meeple_back.game.bluemarble.domain.RoomCreate;
import com.meeple.meeple_back.game.bluemarble.domain.RoomUpdate;
import java.util.List;

public interface BluemarbleRoomService {

	Room create(long userId, RoomCreate roomCreate);

	Room join(int roomId, long userId);

	List<Room> getList();

	Room delete(int roomId, long userId);

	Room update(int roomId, RoomUpdate roomUpdate);

	Room findById(int roomId);

	List<Room> search(String searchName);

	Room changePassword(int roomId, RoomUpdatePassword roomUpdatePassword);

	Room joinWithPassword(int roomId, int userId, RoomJoinWithPassword roomJoinWithPassword);
}
