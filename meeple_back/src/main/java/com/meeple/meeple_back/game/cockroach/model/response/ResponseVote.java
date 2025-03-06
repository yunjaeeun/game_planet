package com.meeple.meeple_back.game.cockroach.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseVote {
    @Schema(description = "투표자 닉네임", example = "nick1")
    private String voter;

    @Schema(description = "승인 여부", example = "false")
    private boolean isApproval;
}
