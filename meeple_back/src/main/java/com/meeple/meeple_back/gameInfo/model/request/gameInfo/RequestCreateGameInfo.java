package com.meeple.meeple_back.gameInfo.model.request.gameInfo;

import com.meeple.meeple_back.game.game.model.Game;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestCreateGameInfo {
    @Schema(description = "게임 정보 설명", example = "이 게임은...")
    private String gameInfoContent;

    @Schema(description = "게임 규칙", example = "이 게임의 규칙은...")
    private String gameRule;

    @Schema(description = "게임 PK", example = "123")
    private int gameId;

}
