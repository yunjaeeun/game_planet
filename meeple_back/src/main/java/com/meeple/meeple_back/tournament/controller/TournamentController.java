//package com.meeple.meeple_back.tournament.controller;
//
//import com.meeple.meeple_back.tournament.model.request.*;
//import com.meeple.meeple_back.tournament.model.response.*;
//import com.meeple.meeple_back.tournament.service.TournamentService;
//import lombok.AllArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping(name = "/tournament")
//@AllArgsConstructor
//public class TournamentController {
//
//    private final TournamentService tournamentService;
//
//    @PostMapping
//    public ResponseEntity<ResponseCreateTournament> createTournament(
//            @RequestBody RequestCreateTournament request
//    ) {
//        ResponseCreateTournament response = tournamentService.createTournament(request);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
//    @GetMapping
//    public ResponseEntity<List<ResponseTournamentList>> getTournamentList() {
//        List<ResponseTournamentList> response = tournamentService.getTournamentList();
//
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/{tournamentId}")
//    public ResponseEntity<ResponseTournament> getTournament(
//            @PathVariable long tournamentId
//    ) {
//        ResponseTournament response = tournamentService.getTournament(tournamentId);
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PutMapping("/{tournamentId}")
//    public ResponseEntity<ResponseUpdateTournament> updateTournament(
//            @PathVariable long tournamentId,
//            @RequestBody RequestUpdateTournament request
//    ) {
//        ResponseUpdateTournament response = tournamentService.updateTournament(tournamentId, request);
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/join")
//    public ResponseEntity<String> joinTournament(
//            @RequestBody RequestJoinTournament request
//    ) {
//        String response = tournamentService.joinTournament(request);
//
//        return ResponseEntity.ok(response);
//    }
//
//    @PostMapping("/create-match")
//    private ResponseEntity<List<ResponseCreateMatch>> createMatch(
//            @RequestBody List<RequestCreateMatch> request
//    ) {
//        List<ResponseCreateMatch> response = tournamentService.createMatch(request);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
//    @PostMapping("/join-room")
//    public ResponseEntity<Map<String, Object>> joinRoom(
//            @RequestBody RequestJoinMatch request
//    ) {
//        Map<String, Object> response = tournamentService.joinMatch(request);
//
//        return ResponseEntity.ok(response);
//    }
//
//
//}
