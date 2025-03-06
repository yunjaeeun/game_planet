package com.meeple.meeple_back.game.catchmind.controller;

import com.meeple.meeple_back.game.catchmind.model.GameResultDTO;
import com.meeple.meeple_back.game.catchmind.model.request.*;
import com.meeple.meeple_back.game.catchmind.model.response.*;
import com.meeple.meeple_back.game.catchmind.service.CatchMindService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catch-mind")
@Tag(name = "CatchMind", description = "캐치마인드 게임 API")
public class CatchMindController {
    private static final String ROOM_KEY = "CATCH_MIND_GAME_ROOMS";
    private final CatchMindService catchMindService;
    private final SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public CatchMindController(CatchMindService catchMindService,
                               SimpMessageSendingOperations messagingTemplate) {
        this.catchMindService = catchMindService;
        this.messagingTemplate = messagingTemplate;
    }

    @Operation(summary = "게임 방 생성", description = "새로운 캐치마인드 게임 방을 생성합니다.")
    @PostMapping("/create-room")
    public ResponseEntity<ResponseCreateRoom> createRoom(
            @RequestBody RequestCreateRoom request
    ) {
        ResponseCreateRoom response = catchMindService.createRoom(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

//    @Operation(summary = "게임 방 참가", description = "기존 캐치마인드 게임 방에 참가합니다.")
//    @PostMapping("/join-room")
//    public ResponseEntity<ResponseJoinRoom> joinRoom(
//            @RequestBody RequestJoinRoom request
//            ) {
//        ResponseJoinRoom response = catchMindService.joinRoom(request);
//
//        return ResponseEntity.status(HttpStatus.OK).body(response);
//    }

    @MessageMapping("/join-room")
    public void joinRoom(
            @RequestBody RequestJoinRoom request
    ) {
        ResponseJoinRoom response = catchMindService.joinRoom(request);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + request.getRoomId(), response);
    }

    @MessageMapping("/update-room/{roomId}")
    public void updateRoom(
            @DestinationVariable String roomId,
            @RequestBody RequestUpdateRoom request
    ) {
        ResponseUpdateRoom response = catchMindService.updateRoom(roomId, request);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @Operation(summary = "게임 방 목록 조회", description = "현재 존재하는 모든 게임 방의 목록을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 방 목록 조회 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = List.class)))
    })
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> roomList() {
        List<Map<String, Object>> response = catchMindService.getList();

        System.out.println(response);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 방 삭제", description = "특정 ID를 가진 게임 방을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 방 삭제 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(example = "Room deleted {roomId}"))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터"),
            @ApiResponse(responseCode = "404", description = "해당 ID의 방을 찾을 수 없음")
    })
    @DeleteMapping("/delete-room")
    public ResponseEntity<String> deleteRoom(@RequestParam String roomId) {
        catchMindService.deleteRoom(roomId);

        return ResponseEntity.ok("Room deleted " + roomId);
    }

    @Operation(summary = "게임 시작 요청", description = "게임 시작 WebSocket 요청을 확인합니다.")
    @GetMapping("/ws/start-game/{roomId}")
    public ResponseEntity<String> startGame(
            @Parameter(description = "게임을 시작할 방 ID", required = true)
            @PathVariable String roomId) {
        return ResponseEntity
                .ok("WebSocket 요청을 ws://localhost:8090/ws/game/start-game/" + roomId + " 로 보내세요.");
    }

    @MessageMapping("/start-game/{roomId}")
    public void startGameSocket(
            @DestinationVariable String roomId
    ) {
        ResponseStartGame response = catchMindService.startGame(roomId);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @Operation(summary = "그림 그리기", description = "그림 그리기 WebSocket 요청을 확인합니다.")
    @GetMapping("/ws/drawing/{roomId}")
    public ResponseEntity<String> drawing(
            @Parameter(description = "그림을 그릴 방 ID", required = true)
            @PathVariable String roomId) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/drawing/" + roomId + " 로 보내세요.");
    }

    @MessageMapping("/drawing/{roomId}")
    public void drawingSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestDrawing request
    ) {
        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, request);
    }

//    @Operation(summary = "퀴즈 요청", description = "퀴즈 요청 WebSocket을 확인합니다.")
//    @GetMapping("/ws/request-quiz/{roomId}")
//    public ResponseEntity<String> requestQuiz(
//            @Parameter(description = "퀴즈를 요청할 방 ID", required = true)
//            @PathVariable String roomId) {
//        return ResponseEntity
//                .ok("WebSocket 요청을 ws://localhost:8090/ws/game/request-quiz/" + roomId + " 로 보내세요.");
//    }
//    @MessageMapping("/request-quiz/{roomId}")
//    public void requestQuizSocket(
//            @DestinationVariable String roomId
//    ) {
//        ResponseQuiz response = catchMindService.requestQuiz(roomId);
//
//        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
//    }

    @MessageMapping("/chat/{roomId}")
    public void handleMessage(
            @DestinationVariable String roomId,
            @RequestBody RequestSendMessage request
    ) {
        ResponseSendMessage response = catchMindService.sendMessage(roomId, request);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @Operation(summary = "게임 결과 요청", description = "게임 결과 WebSocket 요청을 확인합니다.")
    @GetMapping("/ws/game-result/{roomId}")
    public ResponseEntity<String> gameResult(
            @Parameter(description = "게임 결과를 조회할 방 ID", required = true)
            @PathVariable String roomId) {
        return ResponseEntity
                .ok("WebSocket 요청을 ws://localhost:8090/ws/game/game-result/" + roomId + " 로 보내세요.");
    }

//    @MessageMapping("/game-result/{roomId}")
//    public void gameResultSocket(
//            @DestinationVariable String roomId
//    ) {
//        List<GameResultDTO> response = catchMindService.gameResult(roomId);
//
//        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
//    }

    @Operation(summary = "투표 요청", description = "투표 WebSocket 요청을 확인합니다.")
    @GetMapping("/ws/send-vote/{roomId}")
    public ResponseEntity<String> sendVote(
            @Parameter(description = "투표를 진행할 방 ID", required = true)
            @PathVariable String roomId) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/send-vote/" + roomId + " 로 보내세요.");
    }
    @MessageMapping("/send-vote/{roomId}")
    private void sendVote(
            @DestinationVariable String roomId,
            @RequestBody RequestSendVote request
    ) {
        ResponseSendVote response = catchMindService.sendVote(roomId, request);
        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @MessageMapping("/vote/{roomId}")
    private void vote(
            @DestinationVariable String roomId,
            @RequestBody RequestVote request
    ) {
        ResponseVote response = catchMindService.vote(request);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @Operation(summary = "투표 결과 요청", description = "투표 결과 WebSocket 요청을 확인합니다.")
    @GetMapping("/ws/vote-result/{roomId}")
    public ResponseEntity<String> voteResult(
            @Parameter(description = "투표 결과를 확인할 방 ID", required = true)
            @PathVariable String roomId) {
        return ResponseEntity
                .ok("WebSocket 요청을 ws://localhost:8090/ws/game/vote-result/" + roomId + " 로 보내세요.");
    }
    @MessageMapping("/vote-result/{roomId}")
    private void voteResult(
            @DestinationVariable String roomId,
            @RequestBody RequestVoteResult request
    ) {
        ResponseVoteResult response = catchMindService.voteResult(roomId, request);
        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

//    @Operation(summary = "게임 방 나가기 (WebSocket)", description = "플레이어가 게임 방을 나갑니다.")
//    @PostMapping("/exit-room/{roomId}")
//    public ResponseEntity<String> exitRoom(
//            @Parameter(description = "나갈 방 ID", required = true)
//            @PathVariable String roomId,
//            @RequestBody String userNickname
//    ) {
//        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/exit-room/{roomId} 로 보내세요.");
//    }

    @MessageMapping("/exit-room/{roomId}")
    public void exitRoomSocket(
            @DestinationVariable String roomId,
            @RequestParam String userName
    ) {
        ResponseExitCatchmindRoom response = catchMindService.exitRoom(roomId, userName);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @MessageMapping("/time-out/{roomId}")
    private void timeOutSocket(
            @DestinationVariable String roomId
    ) {
        ResponseTimeOut response = catchMindService.quizTimeOut(roomId);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }

    @MessageMapping("/ready/{roomId}")
    private void readySocket(
            @DestinationVariable String roomId,
            @RequestBody RequestCatchMindReady request
    ) {
        ResponseCatchMindReady response = catchMindService.readyRoom(roomId, request);

        messagingTemplate.convertAndSend("/topic/catch-mind/" + roomId, response);
    }
}
