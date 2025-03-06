package com.meeple.meeple_back.game.cockroach.model.entity;

import lombok.Data;

@Data
public class Card {
    private String type;
    private boolean isRoyal;

    public Card(String type, boolean isRoyal) {
        this.type = type;
        this.isRoyal = isRoyal;
    }
}
