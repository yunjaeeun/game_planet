package com.meeple.meeple_back.user.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {
    private String userName;
    private String userNickname;
    private String userEmail;
    private LocalDateTime userBirthday;
    private String userPassword;
    private String userProfilePictureUrl;
    private String userTier;
    private int userLevel;
    private LocalDateTime userCreatedAt;
    private String userBio;
}
