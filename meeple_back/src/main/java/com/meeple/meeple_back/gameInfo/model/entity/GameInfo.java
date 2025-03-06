package com.meeple.meeple_back.gameInfo.model.entity;

import com.meeple.meeple_back.game.game.model.Game;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_game_info")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GameInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_info_id")
    private int gameInfoId;

    @Column(name = "game_info_content")
    private String gameInfoContent;

    @Column(name = "game_rule", columnDefinition = "TEXT")
    private String gameRule;

    @Column(name = "game_info_file")
    private String gameInfoFile;

    @OneToOne
    @JoinColumn(name = "game_id")
    Game game;

}
