//package com.meeple.meeple_back.tournament.model.entity;
//
//import com.meeple.meeple_back.user.model.User;
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "tbl_match_alert")
//public class MatchAlert {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "match_alert_id")
//    private long matchAlertId;
//
//    @Column(name = "match_join_state")
//    private char matchJoinState;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
//
//}
