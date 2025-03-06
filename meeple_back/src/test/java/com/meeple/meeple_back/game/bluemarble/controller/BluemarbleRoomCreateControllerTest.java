package com.meeple.meeple_back.game.bluemarble.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meeple.meeple_back.game.bluemarble.domain.RoomCreate;
import com.meeple.meeple_back.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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
class BluemarbleRoomCreateControllerTest {

	@Autowired
	private MockMvc mockMvc;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@MockBean
	private JwtUtil jwtUtil;

//	@MockBean
//	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Test
	void create() throws Exception {
		when(jwtUtil.getUserIdFromToken(anyString())).thenReturn(1L);
		// 가짜 사용자 정보
		Long userId = 1L;
		String username = "testUser";

		// 가짜 JWT 생성
		String fakeJwtToken = JwtUtil.generateToken(userId, username);
		// given
		RoomCreate roomCreate = RoomCreate.builder()
				.roomName("roomName")
				.isPrivate(true)
				.password("password")
				.maxPlayers(2)
				.build();
		// when
		// then

		mockMvc.perform(
						post("/game/blue-marble/rooms").header("Authorization",
										fakeJwtToken)
								.contentType(MediaType.APPLICATION_JSON)
								.content(objectMapper.writeValueAsString(roomCreate)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.roomId").value(1))
				.andExpect(jsonPath("$.roomName").value("roomName"))
				.andExpect(jsonPath("$.private").value(true))
				.andExpect(jsonPath("$.gameStart").value(false))
				.andExpect(jsonPath("$.maxPlayers").value(2));

	}
}