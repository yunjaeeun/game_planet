package com.meeple.meeple_back.gameInfo.model.response.gameReview;

import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseUpdateReview {
    private int gameReviewId;
    @Schema(description = "리뷰 내용", example = "리뷰 내용", required = true)
    private String gameReviewContent;
    @Schema(description = "리뷰 별점", example = "5", required = true)
    private int gameReviewStar;
    @Schema(description = "사용자 정보", example = "{gameInfoId: 1, ...}", required = true)
    private GameInfo gameInfo;
    @Schema(description = "사용자 정보", example = "{userId: 1, userName: 이름, ...}", required = true)
    private User user;
}
