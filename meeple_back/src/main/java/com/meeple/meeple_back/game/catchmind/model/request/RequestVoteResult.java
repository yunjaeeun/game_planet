package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestVoteResult {
    @Schema(description = "투표 대상자", example = "nick1", required = true)
    private String target;
    @Schema(description = "투표 결과", example = "true", required = true)
    private boolean result;
}
