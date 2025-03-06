package com.meeple.meeple_back.game.catchmind.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageDTO {
    @Schema(description = "해당 게임방 pk", example = "1")
    private String roomId;

    @Schema(description = "메세지 발송자", example = "nick1")
    private String sender;

    @Schema(description = "메세지 내용", example = "내용")
    private String content;

    @Schema(description = "메세지 발송 시간", example = "20240120T12:12")
    private LocalDateTime timestamp;

    @Schema(description = "점수", example = "10")
    private int score;

    @Schema(description = "정답 여부", example = "true")
    private boolean isCorrect;

    @Schema(description = "알림 메시지 여부", example = "true")
    private boolean isNotice;

    @Schema(description = "다음 출제자", example = "김싸피")
    private String nextTurn;

    @Schema(description = "정답", example = "사과")
    private String quiz;

    @Schema(description = "남은 퀴즈 수", example = "2")
    private int remainQuizCount;
}
