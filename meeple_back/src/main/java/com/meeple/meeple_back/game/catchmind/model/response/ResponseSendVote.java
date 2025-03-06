package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseSendVote {
    @Schema(description = "투표 대상자", example = "nick1")
    String voteTarget;
}
