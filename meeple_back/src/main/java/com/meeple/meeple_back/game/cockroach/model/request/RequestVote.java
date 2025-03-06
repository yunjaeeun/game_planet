package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestVote {
    @Schema(description = "투표자 닉네임", example = "nick1")
    private String voter;

    @Schema(description = "승인 여부", example = "false")
    private boolean isApproval;
}
