package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ResponseJoinRoom {
    @Schema(description = "메세지 타입", example = "roomInfo", required = true)
    private String type;
    @Schema(description = "상태코드", example = "200", required = true)
    private int code;
    @Schema(description = "처리 메세지", example = "메세지", required = true)
    private String message;
    @Schema(description = "방 정보", example = "{roomId: 1, creator: nick1, ...}")
    Map<String, Object> roomInfo;
}
