package com.meeple.meeple_back.gameInfo.model.response.community;

import com.meeple.meeple_back.gameInfo.dto.SimpleUserDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.sql.Date;

@Data
public class ResponseCommentList {
    @Schema(description = "댓글 PK", example = "1")
    private int gameCommunityCommentId;

    @Schema(description = "댓글 내용", example = "좋아요!")
    private String gameCommunityCommentContent;

    @Schema(description = "댓글 작성일", example = "2024-12-12")
    private Date createAt;

    @Schema(description = "작성자 정보", example = "{userId: 1, userName: 홍길동}")
    private SimpleUserDTO user;
}