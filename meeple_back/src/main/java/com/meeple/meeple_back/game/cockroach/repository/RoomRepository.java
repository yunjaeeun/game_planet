package com.meeple.meeple_back.game.cockroach.repository;

import com.meeple.meeple_back.game.cockroach.model.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer> {

}
