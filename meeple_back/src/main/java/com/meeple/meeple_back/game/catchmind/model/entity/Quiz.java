package com.meeple.meeple_back.game.catchmind.model.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "tbl_quiz")
@Getter
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private int quizId;

    @Column(name = "quiz")
    private String quiz;

    @ManyToOne
    @JoinColumn(name = "quiz_category_id")
    private QuizCategory quizCategory;
}
