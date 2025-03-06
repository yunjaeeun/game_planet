package com.meeple.meeple_back.game.catchmind.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseCreateRoom {
    @Schema(description = "게임방 Pk", example = "1", required = true)
    private int roomId;

    @Schema(description = "방 생성자 닉네임", example = "김싸피", required = true)
    private String creator;

    @Schema(description = "비밀번호", example = "password11", required = true)
    private String password;

    @Schema(description = "비밀방 여부", example = "true", required = true)
    private boolean isPrivate;

    @Schema(description = "OpenVidu 세션", example = "ses_lY5XF2yEEf", required = true)
    private String sessionId;
}
