package com.meeple.meeple_back.admin.ai.model.request;

import lombok.Data;

@Data
public class RequestLogin {
    private String userEmail;
    private String password;
}
