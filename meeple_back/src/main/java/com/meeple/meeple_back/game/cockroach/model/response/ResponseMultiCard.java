package com.meeple.meeple_back.game.cockroach.model.response;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseMultiCard {
    @Schema(description = "참가자", example = "[nick1, nick2]")
    List<String> players;

    @Schema(description = "게임 정보", example = "{player:[], userTable:[], ...}")
    Map<String, Object> gameData;

    @Schema(description = "게임 종료 여부", example = "true")
    boolean isEnd;

    @Schema(description = "게임 패배자", example = "nick1")
    String loser;
}
