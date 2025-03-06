package com.meeple.meeple_back.gameInfo.model.response.community;

import com.meeple.meeple_back.gameInfo.dto.SimpleUserDTO;
import com.meeple.meeple_back.gameInfo.model.entity.GameCommunityComment;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class ResponseCommunityList {
    @Schema(description = "커뮤니티 PK", example = "1")
    private int gameCommunityId;
    @Schema(description = "게시글 내용", example = "게시글 내용")
    private String gameCommunityContent;
    @Schema(description = "게시글 생성일", example = "2024-12-12")
    private Date createAt;
    @Schema(description = "게시글 삭제일", example = "2024-12-12")
    private Date deletedAt;
    @Schema(description = "작성자", example = "{userId: 1, ...}")
    private SimpleUserDTO user;
    @Schema(description = "댓글 목록", example = "[gameCommunityCommentId: 1, ...}, {}, ...]")
    private List<ResponseCommentList> commentList;
}
