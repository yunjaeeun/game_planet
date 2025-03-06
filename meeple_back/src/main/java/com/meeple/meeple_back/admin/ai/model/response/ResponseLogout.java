package com.meeple.meeple_back.admin.ai.model.response;

import jakarta.annotation.security.DenyAll;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseLogout {
    private int code;
    private String message;
}
