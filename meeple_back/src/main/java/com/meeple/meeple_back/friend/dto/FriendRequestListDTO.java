package com.meeple.meeple_back.friend.dto;

import com.meeple.meeple_back.user.model.User;
import lombok.Data;

@Data
public class FriendRequestListDTO {
    private int friendId;
    private SimpleUserDTO user;
}
