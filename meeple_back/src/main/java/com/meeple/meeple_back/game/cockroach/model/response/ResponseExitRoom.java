package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseExitRoom {
    @Schema(description = "참가자 목록", example = "['nick1', 'nick2']")
    List<String> players;
}
