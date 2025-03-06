package com.meeple.meeple_back.game.cockroach.model.entity;

import lombok.Data;
import java.util.Set;

@Data
public class GameState {
    private String currentTurn;          // 현재 턴인 플레이어 user1 -> user2 pass -> user3
    private String currentPhase;         // CHOOSE_PLAYER(카드 전달), GUESS_OR_FORWARD(맞추기/전달), GUESS_ONLY(무조건 맞추기)
    private Card currentCard;            // 현재 전달 중인 카드
    private String claimedAnimal;        // 선언한 동물
    private boolean isKing;             // 왕으로 선언했는지 여부
    private String cardSender;           // 카드를 준 플레이어
    private String cardReceiver;         // 카드를 받은 플레이어
    private Set<String> passedPlayers;   // 패스한 플레이어들 목록
    private int passCount;               // 패스 횟수 3번 하면 더이상 패스 x
} 