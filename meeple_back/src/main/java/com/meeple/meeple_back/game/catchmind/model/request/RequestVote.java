package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestVote {
    @Schema(description = "투표자", example = "nick1", required = true)
    private String voter;
    @Schema(description = "찬성여부", example = "true", required = true)
    private boolean isApproval;
}
