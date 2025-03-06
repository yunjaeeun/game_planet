package com.meeple.meeple_back.user.model;

import com.meeple.meeple_back.game.game.model.Game;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_winner")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Winner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "winner_id")
    private int winnerId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

}
