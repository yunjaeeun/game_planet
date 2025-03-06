package com.meeple.meeple_back.gameInfo.model.request.commnity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestCreateComment {
    @Schema(description = "댓글 내용", example = "이 게임 정말 재미있어요!")
    private String content;
    @Schema(description = "작성자 ID", example = "1")
    private long userId;
    @Schema(description = "게임 커뮤니티 ID", example = "5")
    private int gameCommunityId;
}
