package com.meeple.meeple_back.game.game.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum GameEnum {
    COCKROACH(1, "바퀴벌레 포커"),
    BLUEMARBLE(2, "부루마불");


    private int gameId;
    private String gameName;
}
