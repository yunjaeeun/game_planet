package com.meeple.meeple_back.friend.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestProcessBlock {
    @Schema(description = "처리할 친구 요청 PK", example = "1")
    private int friendId;
}
