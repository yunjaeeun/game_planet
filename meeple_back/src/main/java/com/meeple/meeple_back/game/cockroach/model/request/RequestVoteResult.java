package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestVoteResult {
    @Schema(description = "투표 대상자 닉네임", example = "false")
    private String target;

    @Schema(description = "투표 결과", example = "true")
    private boolean result;
}
