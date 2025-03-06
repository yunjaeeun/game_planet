package com.meeple.meeple_back.game.cockroach.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestHandCheck {
    @Schema(description = "패를 확인할 사람 닉네임", example = "nick1")
    private String player;
}
