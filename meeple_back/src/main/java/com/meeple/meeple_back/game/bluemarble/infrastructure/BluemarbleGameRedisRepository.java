package com.meeple.meeple_back.game.bluemarble.infrastructure;

import org.springframework.data.repository.CrudRepository;

public interface BluemarbleGameRedisRepository extends CrudRepository<GamePlayEntity, Integer> {

}
