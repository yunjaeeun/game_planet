package com.meeple.meeple_back.friend.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "친구 요청 처리 요청 모델")  // 전체 DTO 설명
public class RequestProcess {

    @Schema(description = "처리할 친구 요청 PK", example = "1")
    private int friendId;


    @Schema(description = "요구 사항(ACCEPT = 승인, DENY = 거절, BLOCK = 차단)", example = "ACCEPT")
    private String requirements;
}
