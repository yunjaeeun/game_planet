package com.meeple.meeple_back.user.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;

@SpringBootTest
@TestPropertySource("classpath:test-application.properties")
@SqlGroup({
        @Sql(value = "/sql/user-service-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD),
        @Sql(value = "/sql/delete-all-data.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
})
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void 중복된_이메일을_가진_회원이_존재하는경우_True를_반환한다() {
        //given
        String email = "john.doe@example.com";
        //when
        boolean result = userService.isDuplicateEmail(email);
        //then
        assertTrue(result);
    }

    @Test
    void 중복된_이메일을_가진_회원이_존재하지않는_False를_반환한다() {
        //given
        String email = "john.doe1@example.com";
        //when
        boolean result = userService.isDuplicateEmail(email);
        //then
        assertFalse(result);
    }

    @Test
    void 중복된_닉네임을_가진_회원이_존재하는경우_True를_리턴한다() {
        //given
        String nickname = "johndoe";
        //when
        boolean result = userService.isDuplicateNickname(nickname);
        //then
        assertTrue(result);
    }

    @Test
    void 중복된_닉네임을_가진_회원이_존재하지_않는_경우_False를_리턴한다() {
        //given
        String nickname = "johndoe1";
        //when
        boolean result = userService.isDuplicateNickname(nickname);
        //then
        assertFalse(result);
    }
}