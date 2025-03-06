package com.meeple.meeple_back.game.catchmind.model.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "tbl_quiz_category")
@Getter
public class QuizCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_category_id")
    private int quizCategoryId;

    @Column(name = "quiz_category")
    private String quizCategory;
}
