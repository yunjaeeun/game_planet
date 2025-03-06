package com.meeple.meeple_back.game.catchmind.repository;

import com.meeple.meeple_back.game.catchmind.model.entity.QuizCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizCategoryRepository extends JpaRepository<QuizCategory, Integer> {
}
