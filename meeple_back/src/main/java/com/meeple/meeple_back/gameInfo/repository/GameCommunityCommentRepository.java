package com.meeple.meeple_back.gameInfo.repository;

import com.meeple.meeple_back.gameInfo.model.entity.GameCommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameCommunityCommentRepository extends JpaRepository<GameCommunityComment, Integer> {
    List<GameCommunityComment> findByGameCommunity_GameCommunityIdAndDeletedAtIsNull(int gameCommunityId);
}
