package com.meeple.meeple_back.game.catchmind.model.response;

import com.meeple.meeple_back.game.catchmind.model.MessageDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResponseSendMessage {
    @Schema(description = "메세지 타입", example = "message")
    private String type;

    @Schema(description = "발송 메세지", example = "{sender: 김싸피, content: 내용, score: 10, ...}")
    private MessageDTO message;
}