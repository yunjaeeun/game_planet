package com.meeple.meeple_back.friend.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseFriendProcess {
    @Schema(description = "상태코드(200, 201, 500)", example = "201")
    private int code;
    @Schema(description = "반환 메세지", example = "친구 요청이 승인됐습니다.")
    private String message;
}
