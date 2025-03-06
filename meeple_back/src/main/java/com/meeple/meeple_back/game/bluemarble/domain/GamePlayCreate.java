package com.meeple.meeple_back.game.bluemarble.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Builder;
import lombok.Getter;


@Builder
@Getter
public class GamePlayCreate {

	private int gamePlayId;
	@NotNull
	private List<Integer> playerIds;

	@JsonCreator
	@Builder
	public GamePlayCreate(@JsonProperty("gamePlayId") int gamePlayId,
			@JsonProperty("players") List<Integer> playerIds) {
		this.gamePlayId = gamePlayId;
		this.playerIds = playerIds;
	}
}
