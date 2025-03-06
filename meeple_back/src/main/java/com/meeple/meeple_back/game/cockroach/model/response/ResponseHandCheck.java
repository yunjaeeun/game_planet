package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseHandCheck {
    @Schema(description = "종료 여부", example = "true")
    private boolean isEnd;

    @Schema(description = "패배자 닉네임", example = "nick1")
    private String loser;
}
