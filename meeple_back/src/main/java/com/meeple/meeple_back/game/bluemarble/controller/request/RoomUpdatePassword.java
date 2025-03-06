package com.meeple.meeple_back.game.bluemarble.controller.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoomUpdatePassword {

	@JsonProperty("password")
	private String password;

	public String getPassword() {
		return password;
	}

}
