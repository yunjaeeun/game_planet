package com.meeple.meeple_back.user.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
public class UserRegistDto {

	@NotBlank
	@Length(min = 2, max = 100)
	private String userName;
	@NotNull
	private LocalDateTime userBirthday;
	@NotBlank
	@Length(min = 8, max = 20)
	private String userPassword;
	@NotBlank
	private String userEmail;
	@NotBlank
	@Length(min = 2, max = 50)
	private String userNickname;

	public UserRegistDto() {
	}

	public UserRegistDto(String userName, LocalDateTime userBirthday, String userPassword,
			String userEmail, String userNickname) {
		this.userName = userName;
		this.userBirthday = userBirthday;
		this.userPassword = userPassword;
		this.userEmail = userEmail;
		this.userNickname = userNickname;
	}
}
