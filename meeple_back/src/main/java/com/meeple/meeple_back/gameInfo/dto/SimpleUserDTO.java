package com.meeple.meeple_back.gameInfo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SimpleUserDTO {
    @Schema(description = "유저 PK", example = "1")
    private long userId;

    @Schema(description = "유저 닉네임", example = "홍길동")
    private String nickname;
}
