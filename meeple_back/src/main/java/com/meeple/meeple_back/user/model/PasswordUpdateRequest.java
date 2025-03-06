package com.meeple.meeple_back.user.model;

import lombok.Data;

@Data
public class PasswordUpdateRequest {
    private String currentPassword;
    private String newPassword;
    private String confirmNewPassword;
}
