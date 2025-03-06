package com.meeple.meeple_back.game.cockroach.model.request;

import com.meeple.meeple_back.game.cockroach.model.entity.Card;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestMultiCard {
    @Schema(description = "카드를 먹는 사람 닉네임", example = "nick1")
    private String user;

    @Schema(description = "카드 목록", example = "[{type: rat, isRoyal: false}, {}]")
    private List<Card> cards;

    @Schema(description = "블랙카드 여부(false면 조커)", example = "false")
    private boolean isBlack;
}
