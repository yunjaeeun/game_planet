package com.meeple.meeple_back.friend.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseFriend {
    @Schema(description = "친구 요청 PK", example = "123")
    private int friendId;
    @Schema(description = "친구 요청 대상 PK", example = "123")
    private long senderId;
    @Schema(description = "친구 요청 대상 닉네임", example = "닉네임1")
    private String senderName;
    @Schema(description = "친구 요청 메세지", example = "발송 메세지")
    private String message;
}
