package com.meeple.meeple_back.friend.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseProcessBlock {
    @Schema(description = "상태코드", example = "200")
    private int code;
    @Schema(description = "메세지", example = "차단이 해제되었습니다.")
    private String message;
}
