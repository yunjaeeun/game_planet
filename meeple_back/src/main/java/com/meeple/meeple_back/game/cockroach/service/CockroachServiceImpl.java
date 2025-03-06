package com.meeple.meeple_back.game.cockroach.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meeple.meeple_back.game.cockroach.model.entity.Card;
import com.meeple.meeple_back.game.cockroach.model.entity.ChatMessage;
import com.meeple.meeple_back.game.cockroach.model.entity.GameState;
import com.meeple.meeple_back.game.cockroach.model.entity.Room;
import com.meeple.meeple_back.game.cockroach.model.request.*;
import com.meeple.meeple_back.game.cockroach.model.response.*;
import com.meeple.meeple_back.game.cockroach.repository.ChatMessageRespository;
import com.meeple.meeple_back.game.cockroach.repository.RoomRepository;
import com.meeple.meeple_back.game.game.model.Game;
import com.meeple.meeple_back.game.game.model.GameResult;
import com.meeple.meeple_back.game.repo.GameRepository;
import com.meeple.meeple_back.game.repo.GameResultRepository;
//import com.meeple.meeple_back.tournament.model.MatchStatus;
//import com.meeple.meeple_back.tournament.model.ParticipantStatus;
//import com.meeple.meeple_back.tournament.model.entity.Match;
//import com.meeple.meeple_back.tournament.model.entity.TournamentParticipant;
//import com.meeple.meeple_back.tournament.repository.MatchRepository;
//import com.meeple.meeple_back.tournament.repository.TournamentParticipantRepository;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class CockroachServiceImpl implements CockroachService {

    private static final String ROOM_KEY = "COCKROACH_GAME_ROOMS";
    private static final String[] CARD_TYPES = {"Bat", "Rat", "Fly",
            "Cockroach", "Scorpion", "Toad", "Stinkbug"};

    private final RedisTemplate<String, Object> redisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;
    private final RoomRepository roomRepository;
    private final ChatMessageRespository chatMessageRespository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameResultRepository gameResultRepository;
//    private final MatchRepository matchRepository;
//    private final TournamentParticipantRepository tournamentParticipantRepository;


    @Override
    @Transactional
    public void sendMessage(String roomId, RequestSendMessage request) {
        Optional<Room> room = roomRepository.findById(Integer.parseInt(roomId));
        User sender = userRepository.findByUserNickname(request.getSender());

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(room.get())
                .sender(sender)
                .content(request.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        chatMessageRespository.save(chatMessage);

        ResponseMessage responseMessage = ResponseMessage.builder()
                .roomId(String.valueOf(room.get().getRoomId()))
                .sender(sender.getUserNickname())
                .timestamp(LocalDateTime.now())
                .content(request.getMessage())
                .build();

        messagingTemplate
                .convertAndSend("/topic/messages/" + roomId, responseMessage);
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


        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        ResponseUpdateRoom response = ResponseUpdateRoom.builder()
                .roomTitle(request.getRoomTitle())
                .isPrivate(request.isPrivate())
                .password(request.getPassword())
                .maxPeople(request.getMaxPeople())
                .build();

        return response;
    }

    @Override
    public ResponseStartGame startGame(String roomId) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writeValueAsString(roomInfo);
            System.out.println(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        if (roomInfo == null) {
            throw new IllegalArgumentException("방을 찾을 수 없습니다 : {}" + roomId);
        }

        Map<String, Object> gameData = (Map<String, Object>) roomInfo.get("gameData");

        List<String> players = (List<String>) roomInfo.get("players");

        try {
            String json = mapper.writeValueAsString(players);
            System.out.println(json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


        /* 카드 분배 */
        List<Map<String, Object>> deck = initializeDeck();

        List<Map<String, Object>> publicDeck = new ArrayList<>();

        publicDeck.addAll(deck.subList(0, 7));
        deck = deck.subList(7, deck.size());

        Map<String, Object> joker = new HashMap<>();
        joker.put("type", "Joker");
        joker.put("isRoyal", false);

        Map<String, Object> black = new HashMap<>();
        joker.put("type", "black");
        joker.put("isRoyal", false);

        deck.add(joker);
        deck.add(black);

        Collections.shuffle(deck);

        Map<String, List<Map<String, Object>>> distributedCards = distributeCards(deck, players);

        Map<String, List<Map<String, Object>>> userTableCards = new HashMap<>();
        for (String player : players) {
            userTableCards.put(player, new ArrayList<>());
        }


        /* redis 저장 */
        gameData.put("publicDeck", publicDeck);
        gameData.put("playerCards", distributedCards);
        gameData.put("userTableCards", userTableCards);
        gameData.put("isGameStart", true);

        // GameState 객체 생성 및 초기화
        Map<String, Object> gameState = new HashMap<>();
        gameState.put("currentTurn", players.get(0));
        gameState.put("currentPhase", "CHOOSE_PLAYER");
        gameState.put("currentCard", null);
        gameState.put("claimedAnimal", null);
        gameState.put("isKing", false);
        gameState.put("cardSender", null);
        gameState.put("passedPlayer", null);
        gameState.put("passCount", 0);

        gameData.put("gameState", gameState);
        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        /* 데이터 반환 */
        ResponseStartGame response = new ResponseStartGame();
        response.setPlayers(players);
        response.setGameData(gameData);

        return response;
    }

    @Override
    public ResponseGiveCard giveCard(String roomId, RequestGiveCard request) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
        Map<String, Object> gameData = (Map<String, Object>) roomInfo.get("gameData");
        Map<String, Object> gameState = (Map<String, Object>) gameData.get("gameState");

        String currentTurn = String.valueOf(gameState.get("currentTurn"));

        // 현재 턴이 아닌 경우 예외 처리
        if (!currentTurn.equals(request.getFrom())) {
            throw new IllegalStateException("현재 턴이 아닙니다.");
        }

        // 카드 이동 처리
        Map<String, List<Map<String, Object>>> playerCards = (Map<String, List<Map<String, Object>>>) gameData.get("playerCards");
        List<Map<String, Object>> fromCards = playerCards.get(request.getFrom());

        // 카드 찾아서 제거
        boolean cardFound = false;
        for (int i = 0; i < fromCards.size(); i++) {
            if (fromCards.get(i).get("type").equals(request.getCard().getType())) {
                fromCards.remove(i);
                cardFound = true;
                break;
            }
        }

        if (!cardFound) {
            throw new IllegalStateException("해당 카드를 가지고 있지 않습니다.");
        }

        // 게임 상태 업데이트
        Map<String, Object> card = new HashMap<>();
        card.put("type", request.getCard().getType());
        card.put("isRoyal", request.getCard().isRoyal());
        gameState.put("currentCard", card);
        gameState.put("claimedAnimal", request.getAnimal());
        gameState.put("isKing", request.isKing());
        gameState.put("cardSender", request.getFrom());
        gameState.put("cardReceiver", request.getTo());
        gameState.put("currentPhase", "GUESS_OR_FORWARD");
        gameState.put("passCount", 0);
        gameState.put("passedPlayers", new HashSet<>());


        // Redis 업데이트
        playerCards.put(request.getFrom(), fromCards);
        gameData.put("gameState", gameState);
        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        return ResponseGiveCard.builder()
                .to(request.getTo())
                .from(request.getFrom())
                .card(request.getCard())
                .animal(request.getAnimal())
                .isKing(request.isKing())
                .isNagative(request.isNagative())
                .build();
    }

    @Override
    public ResponseCheckCard singleCard(String roomId, RequestSingleCard request) {
        /* 방 목록 조회 */
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        if (roomInfo == null) {
            throw new IllegalArgumentException("방을 찾을 수 없습니다: " + roomId);
        }

        Map<String, List<Map<String, Object>>> playerTables = (Map<String, List<Map<String, Object>>>) roomInfo.get(
                "userTableCards");
        if (playerTables == null || !playerTables.containsKey(request.getFrom())) {
            throw new IllegalStateException("플레이어 테이블 정보를 찾을 수 없습니다: "
                    + request.getFrom());
        }

        /* 만약 정답을 맞췄다면 */
        ResponseCheckCard response = ResponseCheckCard.builder()
                .userName(request.getFrom())
                .isEnd(false)
                .build();

        List<Map<String, Object>> giveCards = new ArrayList<>();
        List<Map<String, Object>> publicDeck = (List<Map<String, Object>>) roomInfo.get("publicDeck");

        if (request.isCorrect()) {
            List<Map<String, Object>> table = playerTables.get(request.getFrom());

            Map<String, Object> requestedCard = new HashMap<>();

            requestedCard.put("type", request.getCard().getType());
            requestedCard.put("isRoyal", request.getCard().isRoyal());

            table.add(requestedCard);
            giveCards.add(requestedCard);

            if (request.getCard().isRoyal()) {
                Map<String, Object> card = publicDeck.get(publicDeck.size() - 1);
                publicDeck.remove(publicDeck.size() - 1);

                table.add(card);
                giveCards.add(card);
            }

            playerTables.put(request.getFrom(), table);
            String loser = checkGameFinish(request.getFrom(), roomInfo);

            if (!loser.equals("")) {
                response.setEnd(true);
                response.setLoser(loser);
            }

        } else {
            List<Map<String, Object>> table = playerTables.get(request.getTo());

            Map<String, Object> requestedCard = new HashMap<>();

            requestedCard.put("type", request.getCard().getType());
            requestedCard.put("isRoyal", request.getCard().isRoyal());

            table.add(requestedCard);
            giveCards.add(requestedCard);

            if (request.getCard().isRoyal()) {
                Map<String, Object> card = publicDeck.get(publicDeck.size() - 1);
                publicDeck.remove(publicDeck.size() - 1);

                table.add(card);
                giveCards.add(card);
            }

            playerTables.put(request.getTo(), table);

            response.setUserName(request.getTo());
            String loser = checkGameFinish(request.getTo(), roomInfo);

            if (!loser.equals("")) {
                response.setEnd(true);
                response.setLoser(loser);
            }
        }

        /* Redis 업데이트 */
        roomInfo.put("publicDeck", publicDeck);
        roomInfo.put("playerTableCards", playerTables);
        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        return response;
    }

    @Override
    public ResponseMultiCard multiCard(String roomId, RequestMultiCard request) {
        /* 방 목록 조회 */
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        Map<String, List<Map<String, Object>>> playerCards = (Map<String, List<Map<String, Object>>>) roomInfo.get("playerCards");
        Map<String, List<Map<String, Object>>> userTables =
                (Map<String, List<Map<String, Object>>>) roomInfo.get("userTableCards");

        List<Map<String, Object>> cards = playerCards.get(request.getUser());
        List<Map<String, Object>> tables = userTables.get(request.getUser());

        if (request.isBlack()) {
            for (Card card : request.getCards()) {
                for (int j = 0; j < cards.size(); j++) {
                    if (cards.get(j).get("type").equals(card.getType())) {
                        Map<String, Object> tableCard = cards.get(j);
                        cards.remove(j);
                        tables.add(tableCard);

                        Map<String, Object> black = new HashMap<>();
                        black.put("type", "Black");
                        black.put("isRoyal", false);

                        cards.add(black);
                        break;
                    }
                }
            }
        } else {
            for (Card card : request.getCards()) {
                for (int j = 0; j < cards.size(); j++) {
                    if (cards.get(j).get("type").equals(card.getType())) {
                        Map<String, Object> tableCard = cards.get(j);
                        cards.remove(j);
                        tables.add(tableCard);

                        Map<String, Object> joker = new HashMap<>();
                        joker.put("type", "Joker");
                        joker.put("isRoyal", false);
                        cards.add(joker);
                        break;
                    }
                }
            }
        }
        playerCards.put(request.getUser(), cards);
        userTables.put(request.getUser(), tables);
        roomInfo.put("playerCards", playerCards);
        roomInfo.put("userTableCards", userTables);

        List<String> players = (List<String>) roomInfo.get("players");

        String loser = checkGameFinish(request.getUser(), roomInfo);


        redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);

        ResponseMultiCard response = ResponseMultiCard.builder()
                .gameData(roomInfo)
                .players(players)
                .build();

        if (!loser.equals("")) {
            response.setEnd(true);
            response.setLoser(loser);
        }

        return response;
    }

    @Override
    public ResponseExitRoom exitRoom(String roomId, String userNickname) {
        Map<String, Object> roomInfo =
                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);

        List<String> userList = (List<String>) roomInfo.get("players");

        if (!userNickname.equals(roomInfo.get("creator"))) {
            for (int i = 0; i < userList.size(); i++) {
                String user = userList.get(i);
                if (user.equals(userNickname)) {
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
                if (userList.get(i).equals(userNickname)) {
                    roomInfo.remove(i);
                    break;
                }
            }
        }

        roomInfo.put("player", userList);
        if (userList.size() == 0) {
            redisTemplate.opsForHash().delete(ROOM_KEY, roomId);
        } else {
            redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);
        }


        ResponseExitRoom response = ResponseExitRoom.builder()
                .players(userList)
                .build();

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
    public ResponseCockroachVoteResult voteResult(String roomId, RequestVoteResult request) {
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

            ResponseCockroachVoteResult response = ResponseCockroachVoteResult.builder()
                    .isLeave(true)
                    .target(request.getTarget())
                    .build();

            return response;
        } else {
            ResponseCockroachVoteResult response = ResponseCockroachVoteResult.builder()
                    .target(request.getTarget())
                    .isLeave(false)
                    .build();

            return response;
        }
    }

    @Override
    public ResponseHandCheck handCheck(String roomId, RequestHandCheck request) {
        Map<String, Object> roomInfo = (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
        List<String> players = (List<String>) roomInfo.get("players");

        Game game = gameRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임"));

        for (String player : players) {
            User user = userRepository.findByUserNickname(player);

            if (player.equals(request.getPlayer())) {
                GameResult gameResult = GameResult.builder()
                        .game(game)
                        .user(user)
                        .isWinner('N')
                        .build();
                gameResultRepository.save(gameResult);

            } else {
                GameResult gameResult = GameResult.builder()
                        .game(game)
                        .user(user)
                        .isWinner('N')
                        .build();
                gameResultRepository.save(gameResult);
            }
        }
        ResponseHandCheck response = ResponseHandCheck.builder()
                .isEnd(true)
                .loser(request.getPlayer())
                .build();

        return response;
    }

//    @Override
//    public ResponseGuessCard guessCard(String roomId, RequestGuessCard request) {
//        Map<String, Object> roomInfo =
//                (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
//        Map<String, Object> gameData = (Map<String, Object>) roomInfo.get("gameData");
//        Map<String, Object> gameState = (Map<String, Object>) gameData.get("gameState");
//
//        // 현재 차례가 아닌 경우
//        if (!gameState.get("cardReceiver").equals(request.getFrom())) {
//            throw new IllegalStateException("현재 차례가 아닙니다.");
//        }
//
//        if (request.getAction().equals("PASS")) {
//            // 현재 플레이어를 패스 목록에 추가
//            if (gameState.get("passedPlayers") == null) {
//                gameState.put("passedPlayers", new HashSet<>());
//            }
//            Set<String> passedPlayers = (Set<String>) gameState.get("passedPlayers");
//
//            passedPlayers.add(request.getFrom());
//
//            int passCount = (int) gameState.get("passCount") + 1;
//
//            gameState.put("passCount", passCount);
//
//            // 다음 플레이어 찾기 (패스하지 않은 플레이어 중에서)
//            List<String> players = (List<String>) roomInfo.get("players");
//            int currentIndex = players.indexOf(request.getFrom());
//            String nextPlayer = null;
//
//            // 패스하지 않은 다음 플레이어 찾기
//            for (int i = 1; i <= players.size(); i++) {
//                int nextIndex = (currentIndex + i) % players.size();
//                String candidate = players.get(nextIndex);
//                if (!gameState.getPassedPlayers().contains(candidate) &&
//                        !candidate.equals(gameState.getCardSender())) {
//                    nextPlayer = candidate;
//                    break;
//                }
//            }
//
//            // 다음 플레이어가 없거나 카드를 준 사람이면 무조건 맞춰야 함
//            if (nextPlayer == null || nextPlayer.equals(gameState.getCardSender())) {
//                gameState.setCurrentPhase("GUESS_ONLY");  // 이제 무조건 맞춰야 함
//                nextPlayer = request.getFrom();  // 현재 플레이어가 맞춰야 함
//            }
//
//            gameState.setCardReceiver(nextPlayer);
//            gameData.put("gameState", gameState);
//            redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);
//
//            return ResponseGuessCard.builder()
//                    .nextTurn(nextPlayer)
//                    .isCorrect(false)
//                    .isGameOver(false)
//                    .build();
//        } else {
//            // 참/거짓 판단
//            boolean actualTruth = checkCardTruth(
//                    gameState.getCurrentCard(),
//                    gameState.getClaimedAnimal(),
//                    gameState.isKing()
//            );
//
//            boolean guessedCorrectly = (actualTruth == request.getIsTrue());
//            String losingPlayer = guessedCorrectly ? gameState.getCardSender() : request.getFrom();
//
//            // 카드 처리 및 게임 상태 업데이트
//            Map<String, List<Card>> playerTables = (Map<String, List<Card>>) gameData.get("userTableCards");
//            List<Card> loserTable = playerTables.get(losingPlayer);
//            loserTable.add(gameState.getCurrentCard());
//
//            // 게임 종료 체크
//            String gameOverPlayer = checkGameFinish(losingPlayer, roomInfo);
//            boolean isGameOver = !gameOverPlayer.isEmpty();
//
//            // 다음 턴 설정
//            gameState.setCurrentTurn(losingPlayer);
//            gameState.setCurrentPhase("CHOOSE_PLAYER");
//            gameState.setCurrentCard(null);
//            gameState.setClaimedAnimal(null);
//            gameState.setKing(false);
//            gameState.setCardSender(null);
//            gameState.setCardReceiver(null);
//            gameState.setPassCount(0);
//            gameState.setPassedPlayers(new HashSet<>());
//
//            gameData.put("gameState", gameState);
//            redisTemplate.opsForHash().put(ROOM_KEY, roomId, roomInfo);
//
//            return ResponseGuessCard.builder()
//                    .nextTurn(losingPlayer)
//                    .isCorrect(guessedCorrectly)
//                    .losingPlayer(losingPlayer)
//                    .isGameOver(isGameOver)
//                    .build();
//        }
//    }

    /* 카드 초기 설정 */
    private static List<Map<String, Object>> initializeDeck() {
        List<Map<String, Object>> deck = new ArrayList<>();

        for (String type : CARD_TYPES) {
            for (int i = 0; i < 7; i++) {
                Map<String, Object> card = new HashMap<>();
                card.put("type", type);
                card.put("isRoyal", false);
                deck.add(card);  // 일반 카드 7장
            }
            Map<String, Object> card = new HashMap<>();
            card.put("type", type);
            card.put("isRoyal", true);
            deck.add(card);      // 킹 카드 1장
        }

        Collections.shuffle(deck);
        return deck;
    }

    private Map<String, List<Map<String, Object>>> distributeCards(List<Map<String, Object>> deck, List<String> players) {
        Map<String, List<Map<String, Object>>> playerCards = new HashMap<>();
        int playerCount = players.size();
        int cardsPerPlayer = deck.size() / playerCount;
        int remainingCards = deck.size() % playerCount; // 나머지 카드 수

        // 1. 기본 카드 분배
        for (int i = 0; i < players.size(); i++) {
            playerCards.put(players.get(i),
                    new ArrayList<>(deck.subList(i * cardsPerPlayer, (i + 1) * cardsPerPlayer)));
        }

        // 2. 나머지 카드 처리
        int cardIndex = cardsPerPlayer * playerCount;
        for (int i = 0; i < remainingCards; i++) {
            playerCards.get(players.get(i)).add(deck.get(cardIndex + i)); // 앞쪽 플레이어부터 한 장씩 추가
        }

        return playerCards;
    }

    public String checkGameFinish(String userName, Map<String, Object> roomInfo) {
        // 같은 카드가 4장이거나 각 카드별로 1장
        Map<String, List<Map<String, Object>>> userTableCards =
                (Map<String, List<Map<String, Object>>>) roomInfo.get("userTableCards");

        boolean isFinished = false;

        List<Map<String, Object>> userTable = userTableCards.get(userName);
        Map<String, Integer> cardCount = new HashMap<>();
        for (Map<String, Object> card : userTable) {
            cardCount.put((String) card.get("type"), cardCount.getOrDefault(card.get("type"), 0) + 1);

            if (cardCount.get(card.get("type")) >= 4) {
                isFinished = true;
                break;
            }
        }

        Set<String> allCardTypes = new HashSet<>(List.of(CARD_TYPES));
        Set<String> playerCardTypes = new HashSet<>();

        for (Map<String, Object> card : userTable) {
            playerCardTypes.add((String) card.get("type"));
        }

        if (playerCardTypes.containsAll(allCardTypes)) {
            isFinished = true;
        }

        if (isFinished) {
            List<String> users = (List<String>) roomInfo.get("players");

            Optional<Game> game = gameRepository.findById(1);
            for (String user : users) {
                if (!user.equals(userName)) {
                    User winner = userRepository.findByUserNickname(user);
                    GameResult gameResult = GameResult.builder()
                            .game(game.get())
                            .isWinner('Y')
                            .user(winner)
                            .build();

                    gameResultRepository.save(gameResult);
                } else {
                    User winner = userRepository.findByUserNickname(user);
                    GameResult gameResult = GameResult.builder()
                            .game(game.get())
                            .isWinner('N')
                            .user(winner)
                            .build();

                    gameResultRepository.save(gameResult);
                }
            }

//            if (roomInfo.getOrDefault("isTournament", "").equals("Y")) {
//                long matchId = Long.parseLong(String.valueOf(roomInfo.get("matchId")));
//                Match match = matchRepository.findById(matchId)
//                        .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매치"));
//                match.setMatchStatus(MatchStatus.END);
//                matchRepository.save(match);
//                if (roomInfo.get("isFinal").equals("Y")) {
//                    if (match.getTournamentParticipant().getUser().getUserNickname().equals(userName)) {
//                        TournamentParticipant tournamentParticipant = match.getTournamentParticipant();
//                        tournamentParticipant.setParticipantStatus(ParticipantStatus.LOSE);
//                        TournamentParticipant tournamentParticipant2 = match.getTournamentParticipant2();
//                        tournamentParticipant.setParticipantStatus(ParticipantStatus.WIN);
//                        tournamentParticipantRepository.save(tournamentParticipant);
//                        tournamentParticipantRepository.save(tournamentParticipant2);
//                    } else {
//                        TournamentParticipant tournamentParticipant = match.getTournamentParticipant();
//                        tournamentParticipant.setParticipantStatus(ParticipantStatus.WIN);
//                        TournamentParticipant tournamentParticipant2 = match.getTournamentParticipant2();
//                        tournamentParticipant2.setParticipantStatus(ParticipantStatus.LOSE);
//                        tournamentParticipantRepository.save(tournamentParticipant);
//                        tournamentParticipantRepository.save(tournamentParticipant2);
//                    }
//                } else {
//                    if (match.getTournamentParticipant().getUser().getUserNickname().equals(userName)) {
//                        TournamentParticipant tournamentParticipant = match.getTournamentParticipant();
//                        tournamentParticipant.setParticipantStatus(ParticipantStatus.LOSE);
//                        tournamentParticipantRepository.save(tournamentParticipant);
//
//                    } else {
//                        TournamentParticipant tournamentParticipant2 = match.getTournamentParticipant2();
//                        tournamentParticipant2.setParticipantStatus(ParticipantStatus.LOSE);
//                        tournamentParticipantRepository.save(tournamentParticipant2);
//                    }
//                }
//            }

            return userName;
        } else {
            return "";
        }
    }

    private boolean checkCardTruth(Card card, String claimedAnimal, boolean isKing) {
        // 블랙 카드의 경우
        if (card.getType().equals("Black")) {
            return claimedAnimal.equals("Black");
        }

        // 조커 카드의 경우
        if (card.getType().equals("Joker")) {
            // 왕으로 선언했다면 무조건 거짓
            if (isKing) {
                return false;
            }
            // 일반 동물로 선언했다면 참 (조커는 어떤 동물이든 될 수 있음)
            return true;
        }

        // 일반/왕 카드의 경우
        String baseType = card.getType().replace("King", "");
        return baseType.equals(claimedAnimal) && card.isRoyal() == isKing;
    }
}
