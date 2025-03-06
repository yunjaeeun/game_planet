package com.meeple.meeple_back.friend.model.response;

import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class ResponseFriendMessageList {
    private int friendMessageId;
    @Schema(description = "메세지 내용", example = "내용")
    private String content;
    @Schema(description = "수신자", example = "{userId: 1, userName: 이름, ...}")
    private User user;
    @Schema(description = "발송자", example = "{userId: 2, userName: 이름, ...}")
    private User sender;
}
