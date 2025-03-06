package com.meeple.meeple_back.game.catchmind.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomInfoDTO {
    @Schema(description = "방 제목", example = "캐치마인드 게임방")
    private String roomTitle;
    @Schema(description = "방의 공개 여부", example = "false")
    @JsonProperty("isPrivate")
    private boolean isPrivate;
    @Schema(description = "비공개 방의 비밀번호 (공개 방이면 '')", example = "1234")
    private String password;
    @Schema(description = "최대 참가 인원", example = "6", required = true)
    private int maxPeople;
    @Schema(description = "제한 시간 (초)", example = "60", required = true)
    private int timeLimit;
    @Schema(description = "문제 출제수", example = "10")
    private int quizCount;
}
