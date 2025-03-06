package com.meeple.meeple_back.friend.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestFriend {
    @Schema(description = "친구 요청을 보내는 사용자의 ID", example = "123")
    private long userId;
    @Schema(description = "친구 요청을 보낼 사용자의 ID", example = "123")
    private long friendId;
}
