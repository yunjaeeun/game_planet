package com.meeple.meeple_back.game.cockroach.model.response;

import com.meeple.meeple_back.game.cockroach.model.entity.Card;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseGiveCard {
    @Schema(description = "카드를 받는 사람 닉네임", example = "nick1")
    private String to;      // 받는사람

    @Schema(description = "카드를 주는 사람 닉네임", example = "nick2")
    private String from;    // 주는사람

    @Schema(description = "전달하는 카드", example = "{type: 'cockroach', isRoyal:'false'}")
    private Card card;      // 전해지는 카드

    @Schema(description = "선언한 동물", example = "cockroach")
    private String animal;  // 말한 동물

    @Schema(description = "왕이라고 선언한지", example = "true")
    private boolean isKing; // 왕 여부(~~왕이야)

    @Schema(description = "선언한 동물이 아니라고 말한지", example = "false")
    private boolean isNagative; // 반대 여부(~~ 아니야)
}
