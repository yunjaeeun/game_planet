package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestGuessCard {
    @Schema(description = "판단하는 사람 닉네임", example = "nick1")
    private String from;        // 판단하는 플레이어

    @Schema(description = "행할 행동(GUESS or PASS)", example = "GUESS")
    private String action;      // "GUESS" 또는 "PASS"

    @Schema(description = "판단 여부(GUESS 일 때 사용)", example = "true")
    private Boolean isTrue;     // action이 "GUESS"일 때만 사용, true면 "진실", false면 "거짓"
} 