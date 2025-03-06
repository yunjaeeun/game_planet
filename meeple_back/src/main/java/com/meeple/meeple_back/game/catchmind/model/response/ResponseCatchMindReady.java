package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class ResponseCatchMindReady {
    @Schema(description = "반환타입", example = "ready", required = true)
    private String type;
    @Schema(description = "준비 완료 한 플레이어들", example = "{김싸핑, 최싸피}", required = true)
    private Set<String> readyPlayers;
}
