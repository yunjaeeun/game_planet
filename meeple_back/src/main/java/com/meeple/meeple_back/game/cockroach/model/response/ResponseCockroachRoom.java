package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseCockroachRoom {
    @Schema(description = "상태코드", example = "200", required = true)
    private int code;
    @Schema(description = "처리 메세지", example = "메세지", required = true)
    private String message;
    @Schema(description = "방 정보", example = "{roomId: 1, creator: nick1, ...}")
    Map<String, Object> roomInfo;
}
