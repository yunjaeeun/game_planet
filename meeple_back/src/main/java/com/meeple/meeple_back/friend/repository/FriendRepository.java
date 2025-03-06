package com.meeple.meeple_back.friend.repository;

import com.meeple.meeple_back.friend.model.FriendStatus;
import com.meeple.meeple_back.friend.model.entity.Friend;
import com.meeple.meeple_back.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Integer> {
    List<Friend> findByUser_UserId(long userId);

    boolean existsByUserAndFriend(User to, User from);

    List<Friend> findByUser_UserIdAndFriendStatus(long userId, FriendStatus friendStatus);

    List<Friend> findByFriend_UserIdAndFriendStatus(long userId, FriendStatus friendStatus);

    Friend findByUser_UserIdAndFriend_UserId(long fromId, long targetId);
}
