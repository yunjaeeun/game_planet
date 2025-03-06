package com.meeple.meeple_back.user.service;

import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

   private final UserRepository userRepository;

   public CustomUserDetailsService(UserRepository userRepository) {
       this.userRepository = userRepository;
   }

   /**
    * [사용자 정보 로드]
    * - 주어진 username으로 DB에서 사용자 정보를 조회하고, UserDetails 객체로 반환.
    */
   @Override
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       User user = userRepository.findByUserEmail(username)
               .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

       // 회원탈퇴한 회원(userDeleteAt 필드가 채워져 있는 회원)의 접속 차단
       if (user.getUserDeletedAt() != null) {
           throw new IllegalStateException("탈퇴한 회원입니다.");
       }

       return org.springframework.security.core.userdetails.User.builder()
               .username(user.getUserEmail())
               .password(user.getUserPassword())
               .roles("USER")
               .build();
   }
}