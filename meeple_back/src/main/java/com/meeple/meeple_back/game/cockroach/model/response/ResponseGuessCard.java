package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseGuessCard {
    @Schema(description = "다음 차례 플레이어", example = "nick3")
    private String nextTurn;        // 다음 턴 플레이어

    @Schema(description = "정답 여부", example = "true")
    private boolean isCorrect;      // 맞췄는지 여부

    @Schema(description = "패배자 닉네임", example = "nick1")
    private String losingPlayer;    // 패배한 플레이어 (있는 경우)

    @Schema(description = "게임 종료 여부", example = "true")
    private boolean isGameOver;     // 게임 종료 여부
} 