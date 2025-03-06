package com.meeple.meeple_back.user.controller;

import com.meeple.meeple_back.user.model.UserRegistDto;
import com.meeple.meeple_back.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<Void> regist(@Valid @RequestBody UserRegistDto registerRequest) {
		userService.regist(registerRequest);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}


	/**
	 * [이메일 중복 확인] 이메일이 중복되는지 확인한다.
	 *
	 * @param userEmail
	 * @return 중복되면 true, 중복되지 않으면 false
	 */
	@GetMapping("/checkEmail/{userEmail}")
	public ResponseEntity<Boolean> isDuplicateEmail(@PathVariable("userEmail") String userEmail) {
		boolean isDuplicate = userService.isDuplicateEmail(userEmail);
		return ResponseEntity.ok(isDuplicate);
	}

	/**
	 * [닉네임 중복 확인] 닉네임이 중복되는지 확인한다.
	 *
	 * @param userNickname
	 * @return 중복되면 true, 중복되지 않으면 false
	 */
	@GetMapping("/checkNickname/{userNickname}")
	public ResponseEntity<Boolean> isDuplicateNickname(
			@PathVariable("userNickname") String userNickname) {
		boolean isDuplicate = userService.isDuplicateNickname(userNickname);
		return ResponseEntity.ok(isDuplicate);
	}
}
