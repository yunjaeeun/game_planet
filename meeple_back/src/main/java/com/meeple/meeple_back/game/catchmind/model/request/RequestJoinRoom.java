package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestJoinRoom {
    @Schema(description = "게임방 pk", example = "1", required = true)
    private int roomId;
    @Schema(description = "참가자 닉네임", example = "nick1", required = true)
    private String playerName;
    @Schema(description = "방 비밀번호", example = "pass01")
    private String password;

}
