package com.meeple.meeple_back.user.controller;

import com.meeple.meeple_back.user.model.PasswordConfirmRequest;
import com.meeple.meeple_back.user.model.PasswordUpdateRequest;
import com.meeple.meeple_back.user.model.UserProfileResponse;
import com.meeple.meeple_back.user.model.UserUpdateRequest;
import com.meeple.meeple_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable("userId") Long userId) {
        UserProfileResponse profile = userService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // 프로필 수정
    @PutMapping(value = "/{userId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable("userId") Long userId,
            @RequestPart("userInfo") UserUpdateRequest request,
            @RequestPart(value = "userProfilePicture", required = false) MultipartFile userProfilePicture
            ) {
        // 수정된 프로필 데이터를 응답으로 반환
        UserProfileResponse updatedProfile = userService.updateUserProfile(userId, request, userProfilePicture);
        return ResponseEntity.ok(updatedProfile); // 수정된 데이터와 함께 200 ok 반환
    }

    // 비밀번호 수정
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword (
            @PathVariable("userId") Long userId,
            @RequestBody PasswordUpdateRequest request) {
        // 성공 or 실패 여부만 반환
        userService.updatePassword(userId, request);
        return ResponseEntity.ok().build(); // 수정된 데이터 없이 200 ok 반환
    }

    // 회원탈퇴
    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<?> deleteUser(
            @PathVariable("userId") Long userId,
            @RequestBody PasswordConfirmRequest request) {
        userService.deleteUser(userId, request.getPassword());
        return ResponseEntity.ok().build();
    }
}
