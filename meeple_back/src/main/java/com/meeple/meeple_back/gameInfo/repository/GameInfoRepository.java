package com.meeple.meeple_back.gameInfo.repository;

import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameInfoRepository extends JpaRepository<GameInfo, Integer> {
}
