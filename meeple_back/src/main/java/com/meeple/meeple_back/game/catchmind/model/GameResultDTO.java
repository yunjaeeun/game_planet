package com.meeple.meeple_back.game.catchmind.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameResultDTO {
    @Schema(description = "순위", example = "1", required = true)
    private int rank;
    @Schema(description = "플레이어 닉네임", example = "nick1", required = true)
    private String player;
    @Schema(description = "점수", example = "100", required = true)
    private int point;
}