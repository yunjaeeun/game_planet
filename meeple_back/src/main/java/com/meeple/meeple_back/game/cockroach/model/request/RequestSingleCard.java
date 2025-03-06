package com.meeple.meeple_back.game.cockroach.model.request;

import com.meeple.meeple_back.game.cockroach.model.entity.Card;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestSingleCard {
    @Schema(description = "카드를 주는 사람 닉네임", example = "nick2")
    private String from;    // 준 사람

    @Schema(description = "카드를 받는 사람 닉네임", example = "nick1")
    private String to;      // 받는 사람

    @Schema(description = "전달하는 카드", example = "{type: 'cockroach', isRoyal:'false'}")
    private Card card;      // 카드

    @Schema(description = "정답 여부", example = "false")
    private boolean isCorrect;  // 정답 여부
}
