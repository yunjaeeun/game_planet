package com.meeple.meeple_back.user.repository;

import com.meeple.meeple_back.user.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUserEmail(String userEmail);

	boolean existsUserByUserEmail(String userEmail);

	boolean existsUserByUserNickname(String userNickname);

    User findByUserNickname(String sender);

	Long userId(Long userId);
}