package com.meeple.meeple_back.game.cockroach.model.response;

import com.meeple.meeple_back.game.cockroach.model.entity.Card;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseCheckCard {
    @Schema(description = "카드를 먹을사람 닉네임", example = "nick1")
    private String userName;    // 먹을 플레이어

    @Schema(description = "카드 목록", example = "[{type: rat, isRoyal: false}, {}]")
    private List<Card> cards;          // 먹을 카드

    @Schema(description = "게임 종료 여부", example = "true")
    private boolean isEnd;      // 게임 종료 여부

    @Schema(description = "패배자 닉네임", example = "nick2")
    private String loser;
}
