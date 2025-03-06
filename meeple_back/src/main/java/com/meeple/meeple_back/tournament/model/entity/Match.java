//package com.meeple.meeple_back.tournament.model.entity;
//
//import com.meeple.meeple_back.game.game.model.Game;
//import com.meeple.meeple_back.tournament.model.MatchStatus;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "tbl_match")
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Setter
//@Getter
//public class Match {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "match_id")
//    private long matchId;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "match_result", nullable = false)
//    private MatchStatus matchStatus;
//
//    @Column(name = "match_round")
//    private int matchRound;
//
//    @Column(name = "room_id")
//    private int roomId;
//
//    @ManyToOne
//    @JoinColumn(name = "tournament_participant_id")
//    private TournamentParticipant tournamentParticipant;
//
//    @ManyToOne
//    @JoinColumn(name = "tournament_participant_id_2")
//    private TournamentParticipant tournamentParticipant2;
//
//    @ManyToOne
//    @JoinColumn(name = "game_id")
//    private Game game;
//
//    @ManyToOne
//    @JoinColumn(name = "tournament_id")
//    private Tournament tournament;
//}
