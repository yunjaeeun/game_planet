package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseVoteResult {
    @Schema(description = "투표 대상", example = "nick1", required = true)
    private String target;
    @Schema(description = "퇴장 여부", example = "true", required = true)
    private boolean isLeave;
}
