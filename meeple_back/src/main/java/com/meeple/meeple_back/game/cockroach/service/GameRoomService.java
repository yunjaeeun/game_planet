package com.meeple.meeple_back.game.cockroach.service;

import com.meeple.meeple_back.game.cockroach.model.entity.Room;
import com.meeple.meeple_back.game.cockroach.model.request.RequestCreateRoom;
import com.meeple.meeple_back.game.cockroach.model.request.RequestJoinRoom;
import com.meeple.meeple_back.game.cockroach.model.response.ResponseCockroachRoom;
import com.meeple.meeple_back.game.cockroach.model.response.ResponseCreateRoom;
import com.meeple.meeple_back.game.cockroach.repository.RoomRepository;

import java.time.LocalDateTime;

import com.meeple.meeple_back.game.game.model.Game;
import com.meeple.meeple_back.game.openVidu.service.OpenViduService;
import com.meeple.meeple_back.game.repo.GameRepository;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GameRoomService {

    private static final String ROOM_KEY = "COCKROACH_GAME_ROOMS";

    private final RedisTemplate<String, Object> redisTemplate;
    private final RoomRepository roomRepository;
    private final GameRepository gameRepository;
    private final OpenViduService openViduService;


    public ResponseCreateRoom createRoom(RequestCreateRoom request) {
        Map<String, Object> roomInfo = new HashMap<>();
        List<String> players = new ArrayList<>();
        players.add(request.getCreator());

        Optional<Game> game = gameRepository.findById(request.getGameId());

        try {
            String sessionId = openViduService.createSession();
            roomInfo.put("sessionId", sessionId);
        } catch (OpenViduJavaClientException e) {
            throw new RuntimeException(e);
        } catch (OpenViduHttpException e) {
            throw new RuntimeException(e);
        }

        roomInfo.put("players", players);
        roomInfo.put("roomTitle", request.getRoomTitle());
        roomInfo.put("gameData", new HashMap<>());
        roomInfo.put("gameType", game.get().getGameName());
        roomInfo.put("isPrivate", request.isPrivate());
        roomInfo.put("password", request.getPassword());
        roomInfo.put("isGameStart", false);
        roomInfo.put("creator", request.getCreator());
        roomInfo.put("maxPeople", request.getMaxPeople());
        System.out.println("createRoom service 호출");

        Room room = Room.builder()
                .roomName(request.getRoomTitle())
                .createTime(LocalDateTime.now())
                .game(game.get())
                .build();

        Room savedRoom = roomRepository.save(room);

        roomInfo.put("roomId", savedRoom.getRoomId());

        redisTemplate.opsForHash().put(ROOM_KEY, savedRoom.getRoomId() + "", roomInfo);

        ResponseCreateRoom response = ResponseCreateRoom.builder()
                .roomId(savedRoom.getRoomId())
                .roomInfo(roomInfo)
                .build();
        return response;
    }

    public Map<String, Object> getRoom(String roomId) {
        System.out.println("getRoom service 호출");
        return (Map<String, Object>) redisTemplate.opsForHash().get(ROOM_KEY, roomId);
    }

    public void updateGameData(String roomId, String key, Object value) {
        Map<String, Object> room = getRoom(roomId);

        if (room != null) {
            Map<String, Object> gameData = (Map<String, Object>) room.get("gameData");
            gameData.put(key, value);
            redisTemplate.opsForHash().put(ROOM_KEY, roomId, room);
        }
    }

    public ResponseCockroachRoom addPlayer(RequestJoinRoom request) {
        Map<String, Object> room = getRoom(request.getRoomId() + "");
        boolean isPrivate = Boolean.parseBoolean(String.valueOf(room.get("isPrivate")));
        if (isPrivate) {
            if (!room.get("password").equals(request.getPassword())) {
                ResponseCockroachRoom response = ResponseCockroachRoom.builder()
                        .code(400)
                        .message("비밀번호 불일치")
                        .build();
                return response;
            }
        }

        if (room != null) {
            List<String> players = (List<String>) room.get("players");
            players.add(request.getPlayerName());
            room.put("players", players);
            redisTemplate.opsForHash().put(ROOM_KEY, request.getRoomId() + "", room);
        }

        ResponseCockroachRoom response =  ResponseCockroachRoom.builder()
                .code(200)
                .message("방 입장 성공")
                .roomInfo(room)
                .build();

        return response;
    }

    public void deleteRoom(String roomId) {
        redisTemplate.opsForHash().delete(ROOM_KEY, roomId);
    }

    public List<Map<String, Object>> getAllRooms() {
        System.out.println("getAllRooms service 호출");

        // Redis에서 Object 타입 키를 가져와 String으로 변환
        return redisTemplate.opsForHash()
                .values(ROOM_KEY)
                .stream()
                .map(obj -> (Map<String, Object>) obj) // Object 타입을 String으로 변환
                .collect(Collectors.toList());
    }
}
