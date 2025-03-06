package com.meeple.meeple_back.gameInfo.model.response.gameInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
public class ResponseUpdateGameInfo {
    @Schema(description = "응답코드", example = "200")
    int code;

    @Schema(description = "응답메세지", example = "정상작동")
    String message;

    public ResponseUpdateGameInfo(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
