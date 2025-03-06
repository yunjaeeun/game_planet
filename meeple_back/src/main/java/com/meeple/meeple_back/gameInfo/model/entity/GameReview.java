package com.meeple.meeple_back.gameInfo.model.entity;

import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_game_review")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GameReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_review_id")
    private int gameReviewId;

    @Column(name = "game_review_content")
    private String gameReviewContent;

    @Column(name = "game_review_star")
    private int gameReviewStar;

    @ManyToOne
    @JoinColumn(name = "game_info_id")
    private GameInfo gameInfo;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
