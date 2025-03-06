package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseSendVote {
    @Schema(description = "투표 대상 닉네임", example = "nick1")
    String voteTarget;
}
