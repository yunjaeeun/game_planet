package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseExitCatchmindRoom {
    @Schema(description = "메세지 타입", example = "message")
    private String type;
    @Schema(description = "플레이어 목록", example = "[김싸피, 최싸피]")
    private List<String> players;
}
