package com.meeple.meeple_back.game.bluemarble.infrastructure;

import com.meeple.meeple_back.game.bluemarble.domain.Room;
import com.meeple.meeple_back.game.bluemarble.service.port.BluemarbleRoomRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;


@Repository
@RequiredArgsConstructor
public class BluemarbleRoomRepositoryImpl implements BluemarbleRoomRepository {

	private final BluemarbleRoomJpaRepository bluemarbleRoomJpaRepository;
	private final BlueMarbleRoomRedisRepository blueMarbleRoomRedisRepository;

	@Override
	public RoomEntity save(RoomEntity room) {
		return bluemarbleRoomJpaRepository.save(room);
	}

	@Override
	public Room save(Room room) {
		return blueMarbleRoomRedisRepository.save(room);
	}

	@Override
	public Optional<Room> findById(int roomId) {
		return blueMarbleRoomRedisRepository.findById(roomId);
	}

	@Override
	public List<Room> findAll() {
		Iterable<Room> iterable = blueMarbleRoomRedisRepository.findAll();
		return StreamSupport.stream(iterable.spliterator(), false)
				.collect(Collectors.toList());
	}

	@Override
	public void delete(Room room) {
		blueMarbleRoomRedisRepository.delete(room);
	}

	@Override
	public List<Room> findByRoomName(String searchName) {
		return StreamSupport.stream(blueMarbleRoomRedisRepository.findAll().spliterator(), false)
				.filter(room -> room.getRoomName().contains(searchName))
				.collect(Collectors.toList());
	}


}
