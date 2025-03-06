package com.meeple.meeple_back.gameInfo.model.request.commnity;

import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Data
public class RequestCreateCommunity {
    @Schema(description = "게시글 내용", example = "내용")
    private String gameCommunityContent;
    @Schema(description = "작성자 PK", example = "1")
    private long userId;
    @Schema(description = "게임 정보 PK", example = "1")
    private int gameInfoId;
}
