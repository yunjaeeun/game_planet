package com.meeple.meeple_back.user.controller;

import com.meeple.meeple_back.user.model.LoginRequest;
import com.meeple.meeple_back.util.JwtUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
   private final AuthenticationManager authenticationManager;
   private final JwtUtil jwtUtil;
   private static final Logger logger = LogManager.getLogger(AuthController.class);

   public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
       this.authenticationManager = authenticationManager;
       this.jwtUtil = jwtUtil;
   }


   /**
    * [로그인 요청 엔드포인트]
    * - 클라이언트가 아이디/패스워드를 전송하면 Spring Security의 AuthenticationManager를 통해 인증을 수행.
    * - 인증 성공 시 JWT 토큰을 생성하여 반환.
    */
   @PostMapping("/login")
   public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
       try {
           UsernamePasswordAuthenticationToken authenticationToken =
                   new UsernamePasswordAuthenticationToken(
                           loginRequest.getEmail(),
                           loginRequest.getPassword()
                   );

           Authentication authentication = authenticationManager.authenticate(authenticationToken);

           String token = jwtUtil.generateToken(authentication.getName());

           return ResponseEntity.ok(token);

       } catch (AuthenticationException e) {
           logger.error("Authentication failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
       }
   }
}
