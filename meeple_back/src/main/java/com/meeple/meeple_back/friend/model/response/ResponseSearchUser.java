package com.meeple.meeple_back.friend.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseSearchUser {
    @Schema(description = "상태코드", example = "200")
    private int code;
    @Schema(description = "메세지", example = "조회 성공")
    private String message;
    @Schema(description = "조회한 유저 PK", example = "1")
    private long userId;

}
