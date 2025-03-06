package com.meeple.meeple_back.game.bluemarble.infrastructure;

import com.meeple.meeple_back.game.bluemarble.domain.Room;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlueMarbleRoomRedisRepository extends CrudRepository<Room, Integer> {

}
