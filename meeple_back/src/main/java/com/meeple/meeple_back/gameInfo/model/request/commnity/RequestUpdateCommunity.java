package com.meeple.meeple_back.gameInfo.model.request.commnity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestUpdateCommunity {
    @Schema(description = "업데이트 할 게시글 내용", example = "게시글 내용")
    private String gameCommunityContent;
}
