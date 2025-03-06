package com.meeple.meeple_back.game.cockroach.model.response;

import com.meeple.meeple_back.game.cockroach.model.entity.Player;
import com.meeple.meeple_back.user.model.User;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ResponseStartGame {
    @Schema(description = "참가자 목록", example = "[nick1, nick2]")
    List<String> players;
    @Schema(description = "게임 데이터", example = "{card:{}, table:{}}")
    Map<String, Object> gameData;
}
