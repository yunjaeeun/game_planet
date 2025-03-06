package com.meeple.meeple_back.game.cockroach.model.entity;

import com.meeple.meeple_back.user.model.User;
import java.util.List;
import lombok.Data;

@Data
public class Player {
    private User user;
    private List<String> hands;
    private List<String> dummy;
}
