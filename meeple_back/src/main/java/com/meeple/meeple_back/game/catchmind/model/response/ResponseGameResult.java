package com.meeple.meeple_back.game.catchmind.model.response;

import com.meeple.meeple_back.game.catchmind.model.GameResultDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseGameResult {
    @Schema(description = "메세지 타입", example = "result")
    private String type;
    @Schema(description = "게임 결과", example = "[{playerName: 김싸피, point: 100, rank: 1}, {}, ..]")
    private List<GameResultDTO> result;

}