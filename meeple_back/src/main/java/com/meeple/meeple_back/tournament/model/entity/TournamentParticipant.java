//package com.meeple.meeple_back.tournament.model.entity;
//
//import com.meeple.meeple_back.tournament.model.ParticipantStatus;
//import com.meeple.meeple_back.user.model.User;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "tbl_tournament_participant")
//@Builder
//@Setter
//@Getter
//@NoArgsConstructor
//@AllArgsConstructor
//public class TournamentParticipant {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "tournament_participant_id")
//    private long tournamentParticipantId;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "participant_status", nullable = false)
//    private ParticipantStatus participantStatus;
//
//    @ManyToOne
//    @JoinColumn(name = "tournament_id")
//    private Tournament tournament;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
//}
