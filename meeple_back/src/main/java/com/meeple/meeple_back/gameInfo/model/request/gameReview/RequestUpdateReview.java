package com.meeple.meeple_back.gameInfo.model.request.gameReview;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RequestUpdateReview {
    @Schema(description = "리뷰 내용", example = "리뷰 내용", required = true)
    private String gameReviewContent;
    @Schema(description = "리뷰 별점", example = "5", required = true)
    private int gameReviewStar;
}
