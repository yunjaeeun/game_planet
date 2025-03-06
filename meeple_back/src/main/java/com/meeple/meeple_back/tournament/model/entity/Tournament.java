//package com.meeple.meeple_back.tournament.model.entity;
//
//import com.meeple.meeple_back.game.game.model.Game;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "tbl_tournament")
//@Setter
//@Getter
//public class Tournament {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "tournament_id")
//    private long tournamentId;
//
//    @Column(name = "tournament_title")
//    private String tournamentTitle;
//
//    @Column(name = "tournament_total_round")
//    private int tournamentTotalRound;
//
//    @Column(name = "tournament_info")
//    private String tournamentInfo;
//
//    @Column(name = "tournament_require_rank")
//    private int tournamentRequireRank;
//
//    @Column(name = "tournament_create_date")
//    private LocalDateTime tournamentCreateDate;
//
//    @Column(name = "tournament_end_date")
//    private LocalDateTime tournamentEndDate;
//
//    @Column(name = "tournament_public_state")
//    private char tournamentPublicState;
//
//    @Column(name = "tournament_start_time")
//    private LocalDateTime tournamentStartTime;
//
//    @Column(name = "tournament_end_time")
//    private LocalDateTime tournamentEndTime;
//
//    @ManyToOne
//    @JoinColumn(name = "game_id")
//    private Game game;
//
//}
