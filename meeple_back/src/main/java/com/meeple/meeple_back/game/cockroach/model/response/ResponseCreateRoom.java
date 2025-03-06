package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ResponseCreateRoom {
    @Schema(description = "게임방 PK", example = "n1")
    private int roomId;

    @Schema(description = "방 정보", example = "{title: 방 제목, ... }")
    private Map<String, Object> roomInfo;
}
