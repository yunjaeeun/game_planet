package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseQuiz {
    @Schema(description = "퀴즈 정답", example = "퀴즈 정답", required = true)
    String quiz;
    @Schema(description = "퀴즈 카테고리", example = "퀴즈 카테고리", required = true)
    String nextTurn;
    @Schema(description = "남은 퀴즈 갯수", example = "0", required = true)
    int remainQuizCount;
}
