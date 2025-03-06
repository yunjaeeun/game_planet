package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestSendVote {
    @Schema(description = "투표 대상자 닉네임", example = "nick1")
    String voteTarget;
}
