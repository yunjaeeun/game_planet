package com.meeple.meeple_back.friend.model.response;

import com.meeple.meeple_back.friend.dto.SimpleUserDTO;
import com.meeple.meeple_back.friend.model.FriendStatus;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ResponseFriendList {
    @Schema(description = "친구 요청 PK", example = "123")
    private int friendId;
    @Schema(description = "친구 요청 상태", example = "PENDING")
    private FriendStatus friendStatus;
    @Schema(description = "친구 정보", example = "{userId:123, userEmail:'qweqwe@naver.com', ...}")
    private SimpleUserDTO friend;

}
