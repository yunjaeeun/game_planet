package com.meeple.meeple_back.user.model;

import lombok.Data;

@Data
public class LoginRequest {
   private String email;
   private String password;
}
