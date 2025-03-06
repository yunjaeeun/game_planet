package com.meeple.meeple_back.game.bluemarble.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meeple.meeple_back.game.bluemarble.domain.GamePlayCreate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.Sql.ExecutionPhase;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@TestPropertySource("classpath:test-application.properties")
@SqlGroup({
		@Sql(value = "/sql/post-create-controller-test-data.sql", executionPhase = ExecutionPhase.BEFORE_TEST_METHOD),
		@Sql(value = "/sql/delete-all-data.sql", executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
})
class BluemarbleGameCreateControllerTest {

	@Autowired
	private MockMvc mockMvc;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Test
	void 사용자는_브루마불_게임방을_생성할_수있다() throws Exception {
		// given
		GamePlayCreate gamePlayCreate = GamePlayCreate.builder()
				.gamePlayId(1)
				.playerIds(List.of(1, 2))
				.build();
		// when
		// then
		mockMvc.perform(post("/game/blue-marble/game-plays").contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(gamePlayCreate)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.gamePlayId").value(1))
				.andExpect(jsonPath("$.gameState.gameStatus").value("IN_PROGRESS"))
				.andExpect(jsonPath("$.gameState.currentPlayerIndex").value(0))
				.andExpect(jsonPath("$.gameState.players[0].playerId").value(1));

	}
}