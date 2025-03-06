package com.meeple.meeple_back.user.controller;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.meeple.meeple_back.user.model.UserRegistDto;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Assertions;
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
@TestPropertySource("classpath:test-application.properties")
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@SqlGroup({
		@Sql(value = "/sql/post-create-controller-test-data.sql", executionPhase = ExecutionPhase.BEFORE_TEST_METHOD),
		@Sql(value = "/sql/delete-all-data.sql", executionPhase = ExecutionPhase.AFTER_TEST_METHOD)
})
class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void 객체값을_json_으로_바꿀수_있다() throws JsonProcessingException {

		UserRegistDto userRegistDto = UserRegistDto.builder()
				.userName("dummyUser")
				.userEmail("test@gmail.com").userPassword("test1234").userNickname("testNick")
				.userBirthday(
						LocalDateTime.of(1999, 3, 3, 0, 0)).build();

		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		String result = objectMapper.writeValueAsString(userRegistDto);
		Assertions.assertEquals(
				"{\"userName\":\"dummyUser\",\"userBirthday\":\"1999-03-03T00:00:00\",\"userPassword\":\"test1234\",\"userEmail\":\"test@gmail.com\",\"userNickname\":\"testNick\"}",
				result);
	}

	@Test
	void 사용자는_회원가입을_할_수_있다() throws Exception {

		//given
		UserRegistDto userRegistDto = UserRegistDto.builder()
				.userName("dummyUser")
				.userEmail("test@gmail.com").userPassword("test1234").userNickname("testNick")
				.userBirthday(
						LocalDateTime.of(1999, 3, 3, 0, 0)).build();
		//when
		//then
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		mockMvc.perform(post("/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(userRegistDto)))
				.andExpect(status().isCreated());
	}

	@Test
	void 사용자가_값을_입력하지_않았을때_회원가입_할_수_없다() throws Exception {
		//given
		UserRegistDto userRegistDto = UserRegistDto.builder()
				.userEmail("test@gmail.com").userPassword("test1234").userNickname("testNick")
				.userBirthday(
						LocalDateTime.of(1999, 3, 3, 0, 0)).build();
		//when
		//then
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		mockMvc.perform(post("/user/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(userRegistDto)))
				.andExpect(status().is4xxClientError());
	}

	@Test
	void 중복된_이메일을_조회했을때_True를_반환한다() throws Exception {

		//given
		String userEmail = "dummyUser1@example.com";
		//when
		//then
		mockMvc.perform(get("/user/checkEmail/{userEmail}", userEmail).contentType(
						MediaType.APPLICATION_JSON))
				.andExpect(result -> Assertions.assertTrue(
						Boolean.parseBoolean(result.getResponse().getContentAsString())));
	}

	@Test
	void 중복되지_않은_이메일을_조회했을때_False를_반환한다() throws Exception {

		//given
		String userEmail = "uniqueUser1@example.com";
		//when
		//then
		mockMvc.perform(get("/user/checkEmail/{userEmail}", userEmail).contentType(
						MediaType.APPLICATION_JSON))
				.andExpect(result -> Assertions.assertFalse(
						Boolean.parseBoolean(result.getResponse().getContentAsString())));
	}


	@Test
	void 중복된_닉네임을_조회했을때_True를_반환한다() throws Exception {

		//given
		String nickname = "dummyNick3";
		//when
		//then
		mockMvc.perform(get("/user/checkNickname/{nickname}", nickname).contentType(
						MediaType.APPLICATION_JSON))
				.andExpect(result -> Assertions.assertTrue(
						Boolean.parseBoolean(result.getResponse().getContentAsString())));
	}

	@Test
	void 중복되지_않은_닉네임을_조회했을때_False를_반환한다() throws Exception {

		//given
		String nickname = "fakeNick";
		//when
		//then
		mockMvc.perform(get("/user/checkNickname/{nickname}", nickname).contentType(
						MediaType.APPLICATION_JSON))
				.andExpect(result -> Assertions.assertFalse(
						Boolean.parseBoolean(result.getResponse().getContentAsString())));
	}
}