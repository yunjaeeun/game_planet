package com.meeple.meeple_back.gameInfo.model.response.gameInfo;

import com.meeple.meeple_back.game.game.model.Game;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseCreateGameInfo {
    @Schema(description = "게임 정보 PK", example = "123")
    private int gameInfoId;

    @Schema(description = "게임", example = "{gameId: 1, ...}")
    private Game game;
}
