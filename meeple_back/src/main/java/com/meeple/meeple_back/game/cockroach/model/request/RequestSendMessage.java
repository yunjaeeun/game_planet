package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestSendMessage {
    @Schema(description = "메세지", example = "메세지 내용")
    String message;

    @Schema(description = "메세지 발송자", example = "nick1")
    String sender;
}
