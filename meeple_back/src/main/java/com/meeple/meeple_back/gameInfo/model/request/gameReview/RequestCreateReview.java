package com.meeple.meeple_back.gameInfo.model.request.gameReview;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestCreateReview {
    @Schema(description = "리뷰 내용", example = "리뷰 내용", required = true)
    private String gameReviewContent;
    @Schema(description = "리뷰 별점", example = "5", required = true)
    private int gameReviewStar;
    @Schema(description = "게임 정보 PK", example = "1", required = true)
    private int gameInfoId;
    @Schema(description = "작성자 PK", example = "1", required = true)
    private long userId;
}
