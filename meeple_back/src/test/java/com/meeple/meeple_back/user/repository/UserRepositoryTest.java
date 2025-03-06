package com.meeple.meeple_back.user.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.meeple.meeple_back.user.model.User;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@DataJpaTest
@TestPropertySource("classpath:test-application.properties")
class UserRepositoryTest {
  @Autowired
  private UserRepository userRepository;

  @Test
    void UserRepository가_정상적으로_연결됐다(){
    User user = User.builder()
            .userName("dummyUser")
            .userEmail("dummyUser@example.com")
            .userPassword("dummyPassword")
            .userBirthday(LocalDateTime.now())
            .userNickname("dummyNick")
            .userProfilePictureUrl("http://example.com/dummy.jpg")
            .userTier("dummyTier")
            .userLevel(1)
            .userCreatedAt(LocalDateTime.now())
            .userUpdatedAt(LocalDateTime.now())
            .userDeletedAt(null)
            .build();

    User result = userRepository.save(user);

    //then
    assertThat(result.getUserId()).isNotNull();
  }
}