package com.meeple.meeple_back.game.cockroach.controller;

import com.meeple.meeple_back.game.cockroach.model.request.RequestCreateRoom;
import com.meeple.meeple_back.game.cockroach.model.response.ResponseCockroachRoom;
import com.meeple.meeple_back.game.cockroach.model.response.ResponseCreateRoom;
import com.meeple.meeple_back.game.cockroach.service.CockroachService;
import com.meeple.meeple_back.game.cockroach.service.GameRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/game")
@AllArgsConstructor
@Tag(name = "Cockroach Game", description = "바퀴벌레 게임 방 생성 및 관리 API")
public class CockroachController {

    private final CockroachService cockroachService;
    private final GameRoomService gameRoomService;
    private final SimpMessageSendingOperations messagingTemplate;


    @Operation(summary = "게임 방 생성", description = "새로운 바퀴벌레 게임 방을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/create-room")
    public ResponseEntity<ResponseCreateRoom> createRoom(@RequestBody RequestCreateRoom request) {
        System.out.println("방 생성 호출됨");
        ResponseCreateRoom response = gameRoomService.createRoom(request);
        return ResponseEntity.ok(response);
    }

//    @Operation(summary = "게임 방 참가", description = "특정 바퀴벌레 게임 방에 플레이어가 참가합니다.")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "방 참가 성공"),
//            @ApiResponse(responseCode = "404", description = "방을 찾을 수 없음")
//    })
//    @MessageMapping("/join-room")
//    public void joinRoom(
//        @RequestParam String roomId,
//        @RequestParam String playerName,
//        @RequestParam String password) {
//        ResponseCockroachRoom response = gameRoomService.addPlayer(roomId, playerName, password);
//
//        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
//    }

    @Operation(summary = "게임 데이터 업데이트", description = "게임 방의 특정 데이터를 업데이트합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "데이터 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/update-data")
    public ResponseEntity<String> updateGameData(
            @RequestParam String roomId,
            @RequestParam String key,
            @RequestParam Object value) {
        gameRoomService.updateGameData(roomId, key, value);

        return ResponseEntity.ok("Game data updated for room: " + roomId);
    }

    @Operation(summary = "게임 방 정보 조회", description = "방 ID를 통해 특정 바퀴벌레 게임 방의 정보를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 정보 조회 성공"),
            @ApiResponse(responseCode = "404", description = "방을 찾을 수 없음")
    })
    @GetMapping("/room/{roomId}")
    public ResponseEntity<Map<String, Object>> getRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(gameRoomService.getRoom(roomId));
    }

    @Operation(summary = "게임 방 삭제", description = "방 ID를 이용하여 특정 바퀴벌레 게임 방을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "방을 찾을 수 없음")
    })
    @DeleteMapping("/delete-room")
    public ResponseEntity<String> deleteRoom(@RequestParam String roomId) {
        gameRoomService.deleteRoom(roomId);
        return ResponseEntity.ok("Room deleted: " + roomId);
    }

    @Operation(summary = "전체 게임 방 조회", description = "현재 존재하는 모든 바퀴벌레 게임 방의 ID 리스트를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "방 목록 조회 성공")
    })
    @GetMapping("/rooms")
    public List<Map<String, Object>> getAllRooms() {
        return gameRoomService.getAllRooms();
    }
}
