//package com.meeple.meeple_back.tournament.service;
//
//import com.meeple.meeple_back.game.cockroach.model.entity.Room;
//import com.meeple.meeple_back.game.cockroach.repository.RoomRepository;
//import com.meeple.meeple_back.game.game.model.Game;
//import com.meeple.meeple_back.game.repo.GameRepository;
//import com.meeple.meeple_back.tournament.model.MatchStatus;
//import com.meeple.meeple_back.tournament.model.ParticipantStatus;
//import com.meeple.meeple_back.tournament.model.entity.Match;
//import com.meeple.meeple_back.tournament.model.entity.Tournament;
//import com.meeple.meeple_back.tournament.model.entity.TournamentParticipant;
//import com.meeple.meeple_back.tournament.model.request.*;
//import com.meeple.meeple_back.tournament.model.response.*;
//import com.meeple.meeple_back.tournament.repository.MatchRepository;
//import com.meeple.meeple_back.tournament.repository.TournamentParticipantRepository;
//import com.meeple.meeple_back.tournament.repository.TournamentRepository;
//import com.meeple.meeple_back.user.model.User;
//import com.meeple.meeple_back.user.repository.UserRepository;
//import jakarta.persistence.EntityNotFoundException;
//import lombok.AllArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.modelmapper.convention.MatchingStrategies;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.messaging.simp.SimpMessageSendingOperations;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Service
//@AllArgsConstructor
//public class TournamentServiceImpl implements TournamentService {
//    private final TournamentRepository tournamentRepository;
//    private final TournamentParticipantRepository tournamentParticipantRepository;
//    private final GameRepository gameRepository;
//    private final UserRepository userRepository;
//    private final MatchRepository matchRepository;
//    private final RoomRepository roomRepository;
//    private final ModelMapper mapper;
//    private final RedisTemplate<String, Object> redisTemplate;
//    private final SimpMessageSendingOperations messagingTemplate;
//    private static final String ROOM_KEY = "TOURNAMENT";
//
//
//    @Override
//    public ResponseCreateTournament createTournament(RequestCreateTournament request) {
//
//        Game game = gameRepository.findById(request.getGameId())
//                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임"));
//
//        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
//
//        Tournament tournament = mapper.map(request, Tournament.class);
//
//        tournament.setGame(game);
//
//        Tournament savedTournament = tournamentRepository.save(tournament);
//
//        return mapper.map(savedTournament, ResponseCreateTournament.class);
//    }
//
//    @Override
//    public List<ResponseTournamentList> getTournamentList() {
//        List<Tournament> tournamentList = tournamentRepository.findAll();
//
//        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
//
//        return tournamentList.stream().map(tournament -> mapper
//                        .map(tournament, ResponseTournamentList.class))
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public ResponseTournament getTournament(long tournamentId) {
//        Tournament tournament = tournamentRepository.findById(tournamentId)
//                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 토너먼트 입니다."));
//
//        List<Match> matchList = matchRepository.findByTournament_TournamentId(tournamentId);
//
//        ResponseTournament responseTournament = ResponseTournament.builder()
//                .tournament(tournament)
//                .matchList(matchList)
//                .build();
//
//        return responseTournament;
//    }
//
//    @Override
//    public ResponseUpdateTournament updateTournament(long tournamentId, RequestUpdateTournament request) {
//        Tournament tournament = tournamentRepository.findById(tournamentId)
//                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 토너먼트 입니다."));
//
//        if (!request.getTournamentTitle().equals(tournament.getTournamentTitle())) {
//            tournament.setTournamentTitle(request.getTournamentTitle());
//        }
//
//        if (request.getTournamentTotalRound() != tournament.getTournamentTotalRound()) {
//            tournament.setTournamentTotalRound(request.getTournamentTotalRound());
//        }
//
//        if (!request.getTournamentInfo().equals(tournament.getTournamentInfo())) {
//            tournament.setTournamentInfo(request.getTournamentInfo());
//        }
//
//        if (request.getTournamentRequireRank() != tournament.getTournamentRequireRank()) {
//            tournament.setTournamentRequireRank(request.getTournamentRequireRank());
//        }
//
//        if (request.getTournamentPublicState() != tournament.getTournamentPublicState()) {
//            tournament.setTournamentPublicState(request.getTournamentPublicState());
//        }
//
//        if (!request.getTournamentEndDate().isEqual(tournament.getTournamentEndDate())) {
//            tournament.setTournamentStartTime(request.getTournamentStartTime());
//        }
//
//        if (!request.getTournamentStartTime().isEqual(tournament.getTournamentStartTime())) {
//            tournament.setTournamentStartTime(request.getTournamentStartTime());
//        }
//
//        if (!request.getTournamentEndTime().isEqual(tournament.getTournamentEndTime())) {
//            tournament.setTournamentEndTime(request.getTournamentEndTime());
//        }
//
//        if (request.getGameId() != tournament.getGame().getGameId()) {
//            Game game = gameRepository.findById(request.getGameId())
//                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임입니다."));
//
//            tournament.setGame(game);
//        }
//
//        Tournament updatedTournament = tournamentRepository.save(tournament);
//
//        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
//
//        return mapper.map(updatedTournament, ResponseUpdateTournament.class);
//    }
//
//    @Override
//    public String joinTournament(RequestJoinTournament request) {
//        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
//                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 토너먼트"));
//
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원"));
//
//        List<TournamentParticipant> participantList = tournamentParticipantRepository
//                .findByTournament_TounamentId(request.getTournamentId());
//
//        if (participantList.size() >= tournament.getTournamentTotalRound()) {
//            return "토너먼트 참가 인원이 가득찼습니다";
//        }
//
//        TournamentParticipant tournamentParticipant = TournamentParticipant.builder()
//                .participantStatus(ParticipantStatus.WAIT)
//                .tournament(tournament)
//                .user(user)
//                .build();
//
//        tournamentParticipantRepository.save(tournamentParticipant);
//
//        return user.getUserNickname() + " 토너먼트 참여 성공";
//    }
//
//    @Override
//    public List<ResponseCreateMatch> createMatch(List<RequestCreateMatch> requestList) {
//        List<ResponseCreateMatch> response = new ArrayList<>();
//
//        for (RequestCreateMatch request : requestList) {
//            Tournament tournament = tournamentRepository.findById(request.getTournamentId())
//                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 토너먼트"));
//
//            TournamentParticipant participant = tournamentParticipantRepository.findById(request.getParticipantId())
//                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 참가자"));
//
//            TournamentParticipant participant2 = tournamentParticipantRepository.findById(request.getParticipantId())
//                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 참가자"));
//
//            int roomId = createRoom(tournament.getGame());
//
//            Match match = Match.builder()
//                    .tournamentParticipant(participant)
//                    .tournamentParticipant2(participant2)
//                    .matchRound(request.getMatchRound())
//                    .tournament(tournament)
//                    .game(tournament.getGame())
//                    .matchStatus(MatchStatus.WAIT)
//                    .roomId(roomId)
//                    .build();
//
//
//            Match savedMatch = matchRepository.save(match);
//
//            ResponseCreateMatch responseCreateMatch = new ResponseCreateMatch();
//            responseCreateMatch.setMatch(savedMatch);
//
//            response.add(responseCreateMatch);
//
//            messagingTemplate
//                    .convertAndSend("/alert/" + participant.getUser().getUserId(),
//                            "토너먼트를 확인하세요");
//            messagingTemplate
//                    .convertAndSend("/alert/" + participant2.getUser().getUserId(),
//                            "토너먼트를 확인하세요");
//        }
//
//        return response;
//    }
//
//    @Override
//    public Map<String, Object> joinMatch(RequestJoinMatch request) {
//        Map<String, Object> roomInfo =
//                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, request.getRoomId());
//
//        if (roomInfo.get("creator").equals("")) {
//            roomInfo.put("creator", request.getUserName());
//            roomInfo.put("matchId", request.getMatchId());
//            Match match = matchRepository.findById(request.getMatchId())
//                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 경기"));
//            match.setMatchStatus(MatchStatus.START);
//            matchRepository.save(match);
//        }
//        List<String> players = (List<String>) roomInfo.get("players");
//        players.add(request.getUserName());
//
//        roomInfo.put("players", players);
//
//        redisTemplate.opsForHash().put(ROOM_KEY, request.getRoomId(), roomInfo);
//
//        return roomInfo;
//    }
//
//    public int createRoom(Game game) {
//        Map<String, Object> roomInfo = new HashMap<>();
//
//        List<String> players = new ArrayList<>();
//
//        Room room = Room.builder()
//                .roomName("토너먼트")
//                .createTime(LocalDateTime.now())
//                .game(game)
//                .build();
//
//        Room savedRoom = roomRepository.save(room);
//
//        roomInfo.put("roomId", savedRoom.getRoomId());
//        roomInfo.put("isTournament", "Y");
//        roomInfo.put("players", players);
//        roomInfo.put("gameData", new HashMap<>());
//        roomInfo.put("gameType", game.getGameName());
//        roomInfo.put("isGameStart", false);
//        roomInfo.put("creator", "");
//        roomInfo.put("timeLimit", 30);
//        roomInfo.put("maxPeople", 2);
//
//        redisTemplate.opsForHash().put(ROOM_KEY, savedRoom.getRoomId() + "", roomInfo);
//
//        return savedRoom.getRoomId();
//    }
//}
