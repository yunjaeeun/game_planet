package com.meeple.meeple_back.gameInfo.model.response.community;

import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ResponseCreateCommunity {
    @Schema(description = "커뮤니티 PK", example = "1")
    private int gameCommunityId;

    @Schema(description = "게시글 생성일", example = "2024-12-12")
    private Date createAt;

    @Schema(description = "작성자", example = "{userId: 1, ...}")
    private User user;

    @Schema(description = "게임 정보", example = "{gameInfoId: 1, ...}")
    private GameInfo gameInfo;
}
