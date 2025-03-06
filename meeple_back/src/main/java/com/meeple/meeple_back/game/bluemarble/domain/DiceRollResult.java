package com.meeple.meeple_back.game.bluemarble.domain;

import lombok.Data;

@Data
public class DiceRollResult {

    private final int playerId;
    private final int prevPosition;
    private final int nextPosition;
    private final boolean isDouble;
    private final int firstDice;
    private final int secondDice;
}
