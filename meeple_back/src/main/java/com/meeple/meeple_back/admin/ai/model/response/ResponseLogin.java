package com.meeple.meeple_back.admin.ai.model.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseLogin {
    private long userId;
    private String userNickname;
    private boolean isSuccess;
}
