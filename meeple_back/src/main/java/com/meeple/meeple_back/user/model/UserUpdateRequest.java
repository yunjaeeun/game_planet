package com.meeple.meeple_back.user.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserUpdateRequest {
    private String userName;
    private String userNickname;
    private LocalDateTime userBirthday;
    private String userBio;
}


/*
    userProfilePicture: 파일(이미지)
    userInfo: {
          userName; ~~
          userNickname; ~~
          userBirthday; ~~
          userBio; ~~
          }
*/
