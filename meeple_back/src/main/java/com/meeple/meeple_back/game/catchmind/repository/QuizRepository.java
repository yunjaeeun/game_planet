package com.meeple.meeple_back.game.catchmind.repository;

import com.meeple.meeple_back.game.catchmind.model.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
}
