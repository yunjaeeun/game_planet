package com.meeple.meeple_back.gameInfo.model.response.community;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseUpdateComment {
    @Schema(description = "상태코드", example = "200")
    private int code;
    @Schema(description = "메세지", example = "성공적으로 업데이트 됨")
    private String message;
}
