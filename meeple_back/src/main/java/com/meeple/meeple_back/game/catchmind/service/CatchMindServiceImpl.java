package com.meeple.meeple_back.game.catchmind.service;

import com.meeple.meeple_back.admin.ai.model.response.ResponseSessionAndToken;
import com.meeple.meeple_back.game.catchmind.model.GameResultDTO;
import com.meeple.meeple_back.game.catchmind.model.MessageDTO;
import com.meeple.meeple_back.game.catchmind.model.RoomInfoDTO;
import com.meeple.meeple_back.game.catchmind.model.entity.Quiz;
import com.meeple.meeple_back.game.catchmind.model.request.*;
import com.meeple.meeple_back.game.catchmind.model.response.*;
import com.meeple.meeple_back.game.catchmind.repository.QuizRepository;
import com.meeple.meeple_back.game.cockroach.model.entity.ChatMessage;
import com.meeple.meeple_back.game.cockroach.model.entity.Room;
import com.meeple.meeple_back.game.cockroach.repository.ChatMessageRespository;
import com.meeple.meeple_back.game.cockroach.repository.RoomRepository;
import com.meeple.meeple_back.game.game.model.Game;
import com.meeple.meeple_back.game.openVidu.service.OpenViduService;
import com.meeple.meeple_back.game.repo.GameRepository;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CatchMindServiceImpl implements CatchMindService {
    private static final String ROOM_KEY = "CATCH_MIND_GAME_ROOMS";
    private static final String AI_KEY = "AI_APP_STATUS";
    private final RedisTemplate<String, Object> redisTemplate;
    private final ChatMessageRespository chatMessageRespository;
    private final RoomRepository roomRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final GameRepository gameRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final OpenViduService openViduService;

    /* 게임방 로직 */
    @Override
    public ResponseCreateRoom createRoom(RequestCreateRoom request) {
        if (!redisTemplate.opsForHash().get(AI_KEY, request.getCreator()).equals("ON")
        ) {
            new EntityNotFoundException("AI 기능을 켜주세요");
        }

        Map<String, Object> roomInfo = new HashMap<>();

        List<String> players = new ArrayList<>();

        players.add(request.getCreator());

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임 ID입니다."));

        Room room = Room.builder()
                .roomName(request.getRoomTitle())
                .createTime(LocalDateTime.now())
                .game(game)
                .build();

        Room savedRoom = roomRepository.save(room);

        try {
            String sessionId = openViduService.createSession();
            roomInfo.put("sessionId", sessionId);
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException("OpenVidu JavaClientError 발생"+ e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException("OpenVidu HttpException 발생"+ e);
        }

        Set<String> readyPlayer = new HashSet<>();
        readyPlayer.add(request.getCreator());

        roomInfo.put("roomId", savedRoom.getRoomId());
        roomInfo.put("players", players);
        roomInfo.put("gameData", new HashMap<>());
        roomInfo.put("gameType", "캐치마인드");
        roomInfo.put("isPrivate", request.isPrivate());
        roomInfo.put("password", request.getPassword());
        roomInfo.put("isGameStart", false);
        roomInfo.put("creator", request.getCreator());
        roomInfo.put("maxPeople", request.getMaxPeople());
        roomInfo.put("quizCount", request.getQuizCount());
        roomInfo.put("timeLimit", request.getTimeLimit());
        roomInfo.put("roomTitle", request.getRoomTitle());
        roomInfo.put("readyPlayer", new ArrayList<>());


        redisTemplate.opsForHash().put(ROOM_KEY, savedRoom.getRoomId() + "", roomInfo);

        ResponseCreateRoom response = ResponseCreateRoom.builder()
                .roomId(savedRoom.getRoomId())
                .creator(request.getCreator())
                .isPrivate(request.isPrivate())
                .password(request.getPassword())
                .sessionId((String) roomInfo.getOrDefault("sessionId", ""))
                .build();

        messagingTemplate.convertAndSend("/topic/ai-record" + request.getCreator(), "녹음 시작");


        return response;
    }

    @Override
    public ResponseJoinRoom joinRoom(RequestJoinRoom request) {
        if (!redisTemplate.opsForHash().get(AI_KEY, request.getPlayerName()).equals("ON")
        ) {
            new EntityNotFoundException("AI 기능을 켜주세요");
        }
        // 명시적 문자열 변환
        String roomIdStr = String.valueOf(request.getRoomId());

        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomIdStr);

        if (roomInfo == null) {
            return ResponseJoinRoom.builder()
                    .code(404)
                    .message("방을 찾을 수 없습니다.")
                    .build();
        }

        boolean isPrivate = Boolean.parseBoolean(String.valueOf(roomInfo.get("isPrivate")));

        if (isPrivate) {
            if (!roomInfo.get("password").equals(request.getPassword())) {
                return ResponseJoinRoom.builder()
                        .code(400)
                        .message("비밀번호 불일치")
                        .build();
            }
        }

        // 기존 players 리스트를 새로운 리스트로 교체
        List<String> currentPlayers = (List<String>) roomInfo.get("players");
        List<String> updatedPlayers;

        if (currentPlayers == null || currentPlayers.isEmpty()) {
            updatedPlayers = new ArrayList<>();
            updatedPlayers.add(request.getPlayerName());
        } else {
            // 기존 플레이어 목록에서 null 제거, 중복 제거하고 현재 플레이어 추가
            updatedPlayers = currentPlayers.stream()
                    .filter(Objects::nonNull)  // null 제거
                    .distinct()                // 중복 제거
                    .collect(Collectors.toList());

            // 현재 플레이어가 목록에 없을 경우에만 추가
            if (!updatedPlayers.contains(request.getPlayerName())) {
                updatedPlayers.add(request.getPlayerName());
            }
        }

        // 정제된 플레이어 리스트로 업데이트
        roomInfo.put("players", updatedPlayers);
        redisTemplate.opsForHash().put(ROOM_KEY, roomIdStr, roomInfo);

        messagingTemplate.convertAndSend("/topic/ai-record" + request.getPlayerName(), "녹음 시작");

//        ResponseSessionAndToken responseSessionAndToken = new ResponseSessionAndToken();
//
//        String sessionId = (String) roomInfo.get("sessionId");
//
//        responseSessionAndToken.setSessionId(sessionId);
//        try {
//            String token = openViduService.generateToken(sessionId);
//            responseSessionAndToken.setToken(token);
//        } catch (OpenViduJavaClientException e) {
//            responseSessionAndToken.setToken("error");
//            throw new RuntimeException(e);
//        } catch (OpenViduHttpException e) {
//            responseSessionAndToken.setToken("error");
//            throw new RuntimeException(e);
//        }

//        responseSessionAndToken.setSessionId(sessionId);
//        try {
//            String token = openViduService.generateToken(sessionId);
//            responseSessionAndToken.setToken(token);
//
//            System.out.println("token: " + token);
//            System.out.println("token: " + token);
//            System.out.println("token: " + token);
//        } catch (OpenViduJavaClientException e) {
//            responseSessionAndToken.setToken("error");
//            throw new RuntimeException(e);
//        } catch (OpenViduHttpException e) {
//            responseSessionAndToken.setToken("error");
//            throw new RuntimeException(e);
//        }
//
//        System.out.println("sessionId: " + sessionId);
//        System.out.println("sessionId: " + sessionId);
//        System.out.println("sessionId: " + sessionId);
//
//        messagingTemplate.convertAndSend("/topic/vidu-session/" + request.getPlayerName()
//        , responseSessionAndToken);

        return ResponseJoinRoom.builder()
                .type("roomInfo")
                .code(200)
                .message(request.getPlayerName() + " " + roomIdStr + "번 방 입장 성공")
                .roomInfo(roomInfo)
                .build();
    }

    @Override
    public ResponseUpdateRoom updateRoom(String roomId, RequestUpdateRoom request) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        if (!request.getRoomTitle().equals(roomInfo.get("roomTitle"))) {
            roomInfo.put("roomTitle", request.getRoomTitle());
        }

        if (request.isPrivate() != Boolean.parseBoolean(String.valueOf(roomInfo.get("isPrivate")))) {
            roomInfo.put("isPrivate", request.isPrivate());
        }

        if (!request.getPassword().equals(roomInfo.get("password"))) {
            roomInfo.put("password", request.getPassword());
        }

        if (request.getMaxPeople() != Integer.parseInt(String.valueOf(roomInfo.get("maxPeople")))) {
            roomInfo.put("maxPeople", request.getMaxPeople());
        }

        if (request.getTimeLimit() != Integer.parseInt(String.valueOf(roomInfo.get("timeLimit")))) {
            roomInfo.put("timeLimit", request.getTimeLimit());
        }

        if (request.getQuizCount() != Integer.parseInt(String.valueOf(roomInfo.get("quizCount")))) {
            roomInfo.put("quizCount", request.getQuizCount());
        }

        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        RoomInfoDTO roomInfoDTO = RoomInfoDTO.builder()
                .roomTitle(request.getRoomTitle())
                .isPrivate(request.isPrivate())
                .password(request.getPassword())
                .maxPeople(request.getMaxPeople())
                .timeLimit(request.getTimeLimit())
                .quizCount(request.getQuizCount())
                .build();

        ResponseUpdateRoom response = ResponseUpdateRoom.builder()
            .type("updateRoom")
            .roomInfo(roomInfoDTO)
            .build();

        return response;
    }

    @Override
    public List<Map<String, Object>> getList() {
        return redisTemplate.opsForHash()
                .values(ROOM_KEY)
                .stream()
                .map(obj -> (Map<String, Object>) obj)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteRoom(String roomId) {
        redisTemplate.opsForHash().delete(ROOM_KEY, roomId);
    }


    /* 게임 로직 */
    @Override
    public ResponseStartGame startGame(String roomId) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        List<Quiz> quizList = quizRepository.findAll();
        List<String> players = (List<String>) roomInfo.get("players");

        Collections.shuffle(quizList);
        Collections.shuffle(players);
        quizList = quizList.subList(0, (Integer) roomInfo.get("quizCount"));

        Map<String, Object> gameInfo = new HashMap<>();

        Map<String, Integer> playerScore = new HashMap<>();

        for (String player : players) {
            playerScore.put(player, 0);
        }
        Map<String, Object> newInfo = new HashMap<>();

        String quiz = quizList.get(0).getQuiz();
        quizList.remove(0);

        List<String> strQuiz = new ArrayList<>();
        for (int i = 0; i < quizList.size(); i++) {
            strQuiz.add(quizList.get(i).getQuiz());
        }

        newInfo.put("currentTurn", players.get(0));
        newInfo.put("quiz", quiz);
        newInfo.put("remainQuizCount", quizList.size());

        gameInfo.put("currentTurn", players.get(0));
        gameInfo.put("remainQuizCount", quizList.size());
        gameInfo.put("quiz", quiz);
        gameInfo.put("sequence", players);
        gameInfo.put("playerScore", playerScore);
        gameInfo.put("quizList", strQuiz);

        for (int i = 0; i < quizList.size(); i++) {
            System.out.println(quizList.get(i).getQuiz());
        }

        roomInfo.put("gameInfo", gameInfo);

        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        ResponseStartGame response = ResponseStartGame.builder()
                .type("gameInfo")
                .gameInfo(newInfo)
                .build();

        return response;
    }


//    @Override
//    public ResponseQuiz requestQuiz(String roomId) {
//        Map<String, Object> roomInfo =
//                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
//
//        Map<String, Object> gameInfo = (Map<String, Object>) roomInfo.get("gameInfo");
//
//        List<Quiz> quizList = (List<Quiz>) gameInfo.get("quizList");
//
//        Quiz quiz = quizList.get(0);
//        quizList.remove(0);
//
//        ResponseQuiz response = ResponseQuiz.builder()
//                .quiz(quiz.getQuiz())
//                .quizCategory(quiz.getQuizCategory().getQuizCategory())
//                .remainQuizCount(quizList.size())
//                .build();
//
//        gameInfo.put("quizList", quizList);
//        roomInfo.put("gameInfo", gameInfo);
//        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);
//
//        return response;
//    }

    @Override
    public ResponseSendMessage sendMessage(String roomId, RequestSendMessage request) {
        if (roomId == null || roomId.isEmpty()) {
            throw new IllegalArgumentException("유효하지 않은 roomId 입니다.");
        }

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("빈 메세지는 전송할 수 없습니다.");
        }

        // 시스템 메시지인 경우 즉시 전송하고 리턴
        if ("SYSTEM".equals(request.getSender())) {
            MessageDTO messageDTO = MessageDTO.builder()
                    .sender("SYSTEM")
                    .content(request.getMessage())
                    .timestamp(LocalDateTime.now())
                    .isNotice(true)
                    .score(0)
                    .build();

            ResponseSendMessage response = ResponseSendMessage.builder()
                    .type("message")
                    .message(messageDTO)
                    .build();

            return response;
        }

        User sender = userRepository.findByUserNickname(request.getSender());
        if (sender == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다: " + request.getSender());
        }

        Room room = roomRepository.findById(Integer.parseInt(roomId))
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임방"));

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(room)
                .sender(sender)
                .content(request.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        chatMessageRespository.save(chatMessage);

        Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        if (roomInfo == null) {
            return null;
        }

        // 정답 체크
        if (request.getCorrectAnswer() != null &&
                request.getMessage().trim().equalsIgnoreCase(request.getCorrectAnswer().trim())) {
            Map<String, Object> gameInfo = (Map<String, Object>) roomInfo.get("gameInfo");

//            if (gameInfo == null) {
//                gameInfo = new HashMap<>();
//                roomInfo.put("gameInfo", gameInfo);
//            }

            Map<String, Integer> playerScore = (Map<String, Integer>) gameInfo.get("playerScore");

//            if (playerScore == null) {
//                playerScore = new HashMap<>();
//                gameInfo.put("playerScore", playerScore);
//            }

            int currentScore = playerScore.getOrDefault(request.getSender(), 0);
            playerScore.put(request.getSender(), currentScore + 30);

            gameInfo.put("playerScore", playerScore);

            List<String> players = (List<String>) roomInfo.get("players");


            if (players != null && !players.isEmpty()) {
                String currentTurn = (String) gameInfo.get("currentTurn");
                int currentIndex = currentTurn != null ? players.indexOf(currentTurn) : 0;
                int nextIndex = (currentIndex + 1) % players.size();
                String nextTurn = players.get(nextIndex);

                // 다음 출제자를 gameInfo에 저장
                gameInfo.put("currentTurn", nextTurn);
            }

            List<String> quizList = (List<String>) gameInfo.get("quizList");

            if (quizList.isEmpty()) {
                int finalScore = currentScore + 30;
                playerScore.put(request.getSender(), finalScore);

                // Redis에 업데이트된 점수 저장
                gameInfo.put("playerScore", playerScore);
                roomInfo.put("gameInfo", gameInfo);
                redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

                List<GameResultDTO> gameResult = gameResult(roomId);

                MessageDTO responseMessage = MessageDTO.builder()
                        .sender(sender.getUserNickname())
                        .content(request.getMessage())
                        .timestamp(LocalDateTime.now())
                        .nextTurn(String.valueOf(gameInfo.get("currentTurn")))
                        .isCorrect(true)
                        .remainQuizCount(quizList.size())
                        .score(10)
                        .build();
                ResponseSendMessage responseSendMessage = ResponseSendMessage.builder()
                        .type("message")
                        .message(responseMessage)
                        .build();

                messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, responseSendMessage);

                ResponseGameResult responseResult = ResponseGameResult.builder()
                        .type("result")
                        .result(gameResult)
                        .build();

                messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, responseResult);

                MessageDTO messageDTO = MessageDTO.builder()
                        .sender("SYSTEM")
                        .content("게임 종료")
                        .timestamp(LocalDateTime.now())
                        .isNotice(true)
                        .build();

                ResponseSendMessage response = ResponseSendMessage.builder()
                        .type("message")
//                        .message(messageDTO)
                        .build();

                return response;
            }

            String nextQuiz = quizList.get(0);
            quizList.remove(0);
            gameInfo.put("remainQuizCount", quizList.size());

            roomInfo.put("gameInfo", gameInfo);
            redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

            MessageDTO messageDTO = MessageDTO.builder()
                    .sender(sender.getUserNickname())
                    .content(request.getMessage())
                    .timestamp(LocalDateTime.now())
                    .quiz(nextQuiz)
                    .nextTurn(String.valueOf(gameInfo.get("currentTurn")))
                    .isCorrect(true)
                    .remainQuizCount(quizList.size())
                    .score(10)
                    .build();


            MessageDTO systemMessage = MessageDTO.builder()
                    .sender("SYSTEM")
                    .content(String.format("%s님이 정답을 맞추셨습니다! (정답: %s)",
                            sender.getUserNickname(), request.getCorrectAnswer()))
                    .timestamp(LocalDateTime.now())
                    .isNotice(true)
                    .build();

            ResponseSendMessage response = ResponseSendMessage.builder()
                    .type("message")
                    .message(messageDTO)
                    .build();

            messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, systemMessage);

            return response;

        } else {
            // 일반 메시지 전송
            MessageDTO messageDTO = MessageDTO.builder()
                    .sender(sender.getUserNickname())
                    .content(request.getMessage())
                    .timestamp(LocalDateTime.now())
                    .isCorrect(false)
                    .score(0)
                    .build();

            ResponseSendMessage response = ResponseSendMessage.builder()
                    .type("message")
                    .message(messageDTO)
                    .build();
            return response;
        }
    }

    @Override
    public List<GameResultDTO> gameResult(String roomId) {
        Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
        Map<String, Object> gameInfo = (Map<String, Object>) roomInfo.get("gameInfo");
        Map<String, Integer> playerScore = (Map<String, Integer>) gameInfo.get("playerScore");

        List<GameResultDTO> response = new ArrayList<>();

        for (String player : playerScore.keySet()) {
            int score = playerScore.get(player);
            GameResultDTO result = GameResultDTO.builder()
                    .point(score)
                    .player(player)
                    .build();

            response.add(result);
        }

        response = response.stream()
                .sorted(Comparator.comparingInt(GameResultDTO::getPoint).reversed())
                .collect(Collectors.toList());

        int rank = 1;
        for (int i = 0; i < response.size(); i++) {
            if (i > 0 && response.get(i).getPoint() < response.get(i - 1).getPoint()) {
                rank = i + 1; // 동일 점수가 아닐 경우 rank 갱신
            }
            response.get(i).setRank(rank); // rank 설정
        }

        return response;
    }

    @Override
    public ResponseSendVote sendVote(String roomId, RequestSendVote request) {
        ResponseSendVote response = ResponseSendVote.builder()
                .voteTarget(request.getVoteTarget())
                .build();

        return response;
    }

    @Override
    public ResponseVote vote(RequestVote request) {
        ResponseVote response = ResponseVote.builder()
                .isApproval(request.isApproval())
                .voter(request.getVoter())
                .build();

        return response;
    }

    @Override
    public ResponseVoteResult voteResult(String roomId, RequestVoteResult request) {
        if (request.isResult()) {
            Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
            List<String> players = (List<String>) roomInfo.get("players");

            for (int i = 0; i < players.size(); i++) {
                if (request.getTarget().equals(players.get(i))) {
                    players.remove(i);
                    break;
                }
            }

            roomInfo.put("players", players);
            redisTemplate.opsForHash().put(ROOM_KEY, roomId, players);

            ResponseVoteResult response = ResponseVoteResult.builder()
                    .isLeave(true)
                    .target(request.getTarget())
                    .build();

            return response;
        } else {
            ResponseVoteResult response = ResponseVoteResult.builder()
                    .target(request.getTarget())
                    .isLeave(false)
                    .build();

            return response;
        }
    }

    @Override
    public ResponseExitCatchmindRoom exitRoom(String roomId, String userName) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        List<String> userList = (List<String>) roomInfo.get("players");

        if (!userName.equals(roomInfo.get("creator"))) {
            for (int i = 0; i < userList.size(); i++) {
                String user = userList.get(i);
                if (user.equals(userName)) {
                    userList.remove(i);
                    break;
                }
            }
        } else {
            for (int i = 0; i < userList.size(); i++) {
                if (!userList.get(i).equals(roomInfo.get("creator"))) {
                    roomInfo.put("creator", userList.get(i));
                    break;
                }
            }

            for (int i = 0; i < userList.size(); i++) {
                if (userList.get(i).equals(userName)) {
                    userList.remove(i);
                    break;
                }
            }
        }

        roomInfo.put("players", userList);
        if (userList.size() == 0) {
            redisTemplate.opsForHash().delete(ROOM_KEY, roomId);
        } else {
            redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);
        }

        messagingTemplate.convertAndSend("/topic/ai-record" + userName, "녹음 종료");


        return ResponseExitCatchmindRoom.builder()
                .type("players")
                .players(userList)
                .build();
    }

    @Override
    public ResponseTimeOut quizTimeOut(String roomId) {
        Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
        Map<String, Object> gameInfo = (Map<String, Object>) roomInfo.get("gameInfo");

        List<String> players = (List<String>) roomInfo.get("players");

        if (players != null && !players.isEmpty()) {
            String currentTurn = (String) gameInfo.get("currentTurn");
            int currentIndex = currentTurn != null ? players.indexOf(currentTurn) : 0;
            int nextIndex = (currentIndex + 1) % players.size();
            String nextTurn = players.get(nextIndex);

            // 다음 출제자를 gameInfo에 저장
            gameInfo.put("currentTurn", nextTurn);
        }

        List<String> quizList = (List<String>) gameInfo.get("quizList");

        if (quizList.isEmpty()) {
            List<GameResultDTO> gameResult = gameResult(roomId);

            ResponseGameResult responseResult = ResponseGameResult.builder()
                    .type("result")
                    .result(gameResult)
                    .build();

            messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, responseResult);

            MessageDTO messageDTO = MessageDTO.builder()
                    .sender("SYSTEM")
                    .content("게임 종료")
                    .timestamp(LocalDateTime.now())
                    .isNotice(true)
                    .build();
            messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, messageDTO);
            return null;
        }

        String nextQuiz = quizList.get(0);
        quizList.remove(0);
        gameInfo.put("remainQuizCount", quizList.size());

        roomInfo.put("gameInfo", gameInfo);
        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        ResponseQuiz responseQuiz = ResponseQuiz.builder()
                .nextTurn(String.valueOf(gameInfo.get("currentTurn")))
                .quiz(nextQuiz)
                .remainQuizCount(quizList.size())
                .build();

        ResponseTimeOut responseTimeOut = ResponseTimeOut.builder()
                .type("timeOut")
                .gameData(responseQuiz)
                .build();

        return responseTimeOut;
    }

    @Override
    public ResponseCatchMindReady readyRoom(String roomId, RequestCatchMindReady request) {
        Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        Set<String> readyPlayer = (Set<String>) roomInfo.get("readyPlayer");

        if (readyPlayer.contains(request.getUserNickname())) {
            readyPlayer.remove(request.getUserNickname());
        } else {
            readyPlayer.add(request.getUserNickname());
        }

        ResponseCatchMindReady response = ResponseCatchMindReady.builder()
                .type("ready")
                .readyPlayers(readyPlayer)
                .build();

        return response;
    }
}