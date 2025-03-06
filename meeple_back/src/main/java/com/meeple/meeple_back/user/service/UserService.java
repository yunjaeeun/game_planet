package com.meeple.meeple_back.user.service;


import com.meeple.meeple_back.aws.s3.service.S3Service;
import com.meeple.meeple_back.user.model.PasswordUpdateRequest;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.model.UserProfileResponse;
import com.meeple.meeple_back.user.model.UserRegistDto;
import com.meeple.meeple_back.user.model.UserUpdateRequest;
import com.meeple.meeple_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final S3Service s3Service;

	public void regist(UserRegistDto user) {
		userRepository.save(User.builder()
				.userName(user.getUserName())
				.userPassword(passwordEncoder.encode(user.getUserPassword()))
				.userEmail(user.getUserEmail())
				.userBirthday(user.getUserBirthday())
				.userNickname(user.getUserNickname())
				.build());
	}


	public boolean isDuplicateEmail(String userEmail) {
		return userRepository.existsUserByUserEmail(userEmail);
	}

	public boolean isDuplicateNickname(String userNickname) {
		return userRepository.existsUserByUserNickname(userNickname);

	}

	// 프로필 정보 조회
	@Transactional(readOnly = true)
	public UserProfileResponse getUserProfile(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(
						() -> new EntityNotFoundException("User not found with ID: " + userId));

		return UserProfileResponse.builder()
				.userName(user.getUserName())
				.userNickname(user.getUserNickname())
				.userEmail(user.getUserEmail())
				.userBirthday(user.getUserBirthday())
				.userPassword(user.getUserPassword())
				.userProfilePictureUrl(user.getUserProfilePictureUrl())
				.userTier(user.getUserTier())
				.userLevel(user.getUserLevel())
				.userCreatedAt(user.getUserCreatedAt())
				.userBio(user.getUserBio())
				.build();
	}

	// 프로필 정보 수정
	@Transactional
	public UserProfileResponse updateUserProfile(Long userId, UserUpdateRequest request
			, MultipartFile userProfilePicture) {
		// 사용자 조회
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		// 요청된 정보만 선택적으로 업데이트
		if (request.getUserName() != null) {
			user.setUserName(request.getUserName());
		}
		if (request.getUserNickname() != null) {
			user.setUserNickname(request.getUserNickname());
		}
		if (request.getUserBirthday() != null) {
			user.setUserBirthday(request.getUserBirthday());
		}
		if (request.getUserBio() != null) {
			user.setUserBio(request.getUserBio());
		}
		if (userProfilePicture != null && !userProfilePicture.isEmpty()) {
			String imgUrl = s3Service.uploadFile(userProfilePicture);
			user.setUserProfilePictureUrl(imgUrl);
		}

		// 수정 시간 업데이트 및 저장
		user.setUserUpdatedAt(LocalDateTime.now());
		User savedUser = userRepository.save(user);

		// 수정된 정보를 응답 객체로 변환하여 반환
		return UserProfileResponse.builder()
				.userName(savedUser.getUserName())
				.userNickname(savedUser.getUserNickname())
				.userEmail(savedUser.getUserEmail())
				.userBirthday(savedUser.getUserBirthday())
				.userPassword(savedUser.getUserPassword())
				.userProfilePictureUrl(savedUser.getUserProfilePictureUrl())
				.userTier(savedUser.getUserTier())
				.userLevel(savedUser.getUserLevel())
				.userCreatedAt(savedUser.getUserCreatedAt())
				.userProfilePictureUrl(savedUser.getUserProfilePictureUrl())
				.userBio(savedUser.getUserBio())
				.build();
	}

	// 비밀번호 수정
	@Transactional
	public void updatePassword(Long userId, PasswordUpdateRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		// 현재 비밀번호 확인
		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getUserPassword())) {
			throw new IllegalArgumentException("Current password is incorrect");
		}

		// 새 비밀번호 확인
		if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
			throw new IllegalArgumentException("New password and confirm password do not match");
		}

		// 새 비밀번호 암호화 및 저장
		user.setUserPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setUserUpdatedAt(LocalDateTime.now());
		userRepository.save(user);
	}

	// 회원 탈퇴
	@Transactional
	public void deleteUser(Long userId, String password) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		// 탈퇴 전 비밀번호로 사용자 검증
		if (!passwordEncoder.matches(password, user.getUserPassword())) {
			throw new IllegalArgumentException("Not matches password");
		}

		user.setUserDeletedAt(LocalDateTime.now());
		user.setUserUpdatedAt(LocalDateTime.now());
		userRepository.save(user);
	}

	public User findById(long creator) {
		return userRepository.findById(creator)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));
	}
}
