package com.meeple.meeple_back.gameInfo.model.response.gameReview;

import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import com.meeple.meeple_back.gameInfo.model.entity.GameReview;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseReviewList {
    @Schema(description = "게임 리뷰 목록", example = "[{gameReviewId: 1, }, {}, ...]")
    private List<GameReview> reviewList;
    @Schema(description = "평균 별점", example = "3.0")
    private double starAvg;
}
