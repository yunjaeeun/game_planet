package com.meeple.meeple_back.game.catchmind.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestCatchMindReady {
    @Schema(description = "사용자 닉네임", example = "김싸핑", required = true)
    private String userNickname;
}
