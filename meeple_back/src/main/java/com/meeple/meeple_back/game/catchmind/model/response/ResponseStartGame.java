package com.meeple.meeple_back.game.catchmind.model.response;

import com.meeple.meeple_back.game.catchmind.model.entity.Quiz;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Builder
@Data
public class ResponseStartGame {
    @Schema(description = "메세지 타입", example = "gameInfo")
    private String type;
    @Schema(description = "게임 정보", example = "{currentTurn: 김싸피, quiz: 사과}")
    private Map<String, Object> gameInfo;

}
