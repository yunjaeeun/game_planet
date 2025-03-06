package com.meeple.meeple_back.admin.ai.model.response;

import lombok.Builder;
import lombok.Data;

@Data
public class ResponseSessionAndToken {
    String sessionId;
    String token;
}
