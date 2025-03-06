package com.meeple.meeple_back.gameInfo.model.response.community;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ResponseCreateComment {
    @Schema(description = "댓글 ID", example = "10")
    private int gameCommunityCommentId;
    @Schema(description = "작성자 닉네임", example = "닉네임1")
    private String userName;
    @Schema(description = "댓글 작성일", example = "2025-02-01")
    private Date createdAt;
}
