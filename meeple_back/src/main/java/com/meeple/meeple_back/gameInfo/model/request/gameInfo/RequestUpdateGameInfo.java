package com.meeple.meeple_back.gameInfo.model.request.gameInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RequestUpdateGameInfo {
    @Schema(description = "게임 정보 설명", example = "이 게임은...")
    private String gameInfoContent;

    @Schema(description = "게임 규칙", example = "이 게임의 규칙은...")
    private String gameRule;
}
