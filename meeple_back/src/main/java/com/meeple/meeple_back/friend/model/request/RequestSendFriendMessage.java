package com.meeple.meeple_back.friend.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestSendFriendMessage {
    @Schema(description = "메세지 내용", example = "내용")
    private String content;
    @Schema(description = "수신자 PK", example = "1")
    private long userId;
    @Schema(description = "발송자 PK", example = "2")
    private long senderId;
}
