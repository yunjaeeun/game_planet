package com.meeple.meeple_back.gameInfo.repository;

import com.meeple.meeple_back.gameInfo.model.entity.GameReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameReviewRepository extends JpaRepository<GameReview, Integer> {
    List<GameReview> findByGameInfo_GameInfoId(int gameInfoId);
}
