package com.meeple.meeple_back.friend.repository;

import com.meeple.meeple_back.friend.model.entity.FriendMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendMessageRepository extends JpaRepository<FriendMessage, Integer> {
    List<FriendMessage> findByUser_UserId(long userId);

    List<FriendMessage> findByUser_UserIdAndDeletedAtIsNull(long userId);
}
