package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestSendVote {
    @Schema(description = "투표 대상자", example = "nick1", required = true)
    String voteTarget;
}
