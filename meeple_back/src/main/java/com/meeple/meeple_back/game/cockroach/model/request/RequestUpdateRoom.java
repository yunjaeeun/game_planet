package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestUpdateRoom {
    @Schema(description = "방 제목", example = "room1")
    private String roomTitle;

    @Schema(description = "비밀방 여부", example = "true")
    private boolean isPrivate;

    @Schema(description = "비밀번호(비빌방일 때만 필수)", example = "pass1")
    private String password;

    @Schema(description = "방 참가 최대 인원수", example = "4")
    private int maxPeople;
}
