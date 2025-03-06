package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "그림 그리기 요청 모델")
public class RequestDrawing {

    @Schema(description = "그리기 이벤트 유형 (예: 'draw', 'clear')", example = "draw", required = true)
    private String type;

    @Schema(description = "게임 방 ID", example = "101", required = true)
    private int roomId;

    @Schema(description = "사용자 ID", example = "1001", required = true)
    private long userId;

    @Schema(description = "X 좌표", example = "150", required = true)
    private int x;

    @Schema(description = "Y 좌표", example = "200", required = true)
    private int y;

    @Schema(description = "이전 X 좌표", example = "140")
    private int lastX;

    @Schema(description = "이전 Y 좌표", example = "190")
    private int lastY;

    @Schema(description = "선 색상", example = "#FF5733", required = true)
    private String color;

    @Schema(description = "선 두께", example = "5", required = true)
    private String lineWidth;
}
