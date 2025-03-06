package com.meeple.meeple_back.gameInfo.repository;

import com.meeple.meeple_back.gameInfo.model.entity.GameCommunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameCommunityRepository extends JpaRepository<GameCommunity, Integer> {
    List<GameCommunity> findByGameInfo_GameInfoIdAndDeletedAtIsNull(int gameInfoId);
}
