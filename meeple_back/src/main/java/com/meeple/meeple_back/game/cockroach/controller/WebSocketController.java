package com.meeple.meeple_back.game.cockroach.controller;

import com.meeple.meeple_back.game.cockroach.model.request.*;
import com.meeple.meeple_back.game.cockroach.model.response.*;
import com.meeple.meeple_back.game.cockroach.service.CockroachService;
import com.meeple.meeple_back.game.cockroach.service.GameRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "WebSocket Game", description = "WebSocket을 이용한 바퀴벌레 게임 관련 API")
@AllArgsConstructor
public class WebSocketController {

    private final GameRoomService gameRoomService;
    private final CockroachService cockroachService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/game/join-room")
    public void joinRoom(
            @RequestBody RequestJoinRoom request) {
        ResponseCockroachRoom response = gameRoomService.addPlayer(request);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId(), response);
    }

    // WebSocket API를 Swagger에서 확인할 수 있도록 REST API 엔드포인트 추가
    @Operation(summary = "게임 채팅 (WebSocket)", description = "특정 게임 방에서 채팅 메시지를 보냅니다.")
    @PostMapping("/chat/{roomId}")
    public ResponseEntity<String> requestChat(
            @Parameter(description = "대화가 이루어질 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody RequestSendMessage request
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/chat/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/chat/{roomId}")
    public void handleMessage(
            @DestinationVariable String roomId,
            @RequestBody RequestSendMessage request) {
        if (roomId == null || roomId.isEmpty()) {
            throw new IllegalArgumentException("유효하지 않은 roomId 입니다.");
        }

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("빈 메세지는 전송할 수 없습니다.");
        }

        // 받은 메시지를 콘솔에 출력 (디버깅용)
        System.out.println("Received message in room " + roomId + ": "
                + request.getMessage());

        cockroachService.sendMessage(roomId, request);
    }

    @Operation(summary = "게임 방 정보 업데이트", description = "특정 게임 방의 상태를 업데이트합니다.")
    @MessageMapping("/game/update-room/{roomId}")
    public void updateRoom(
            @DestinationVariable String roomId,
            @RequestBody RequestUpdateRoom request
    ) {
        ResponseUpdateRoom response = cockroachService.updateRoom(roomId, request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "게임 시작 (WebSocket)", description = "방장이 게임을 시작합니다.")
    @PostMapping("/start-game/{roomId}")
    public ResponseEntity<String> startGame(
            @Parameter(description = "게임을 시작할 방 ID", required = true)
            @PathVariable String roomId
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/start-game/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/start-game/{roomId}")
    public void startGameSocket(
            @DestinationVariable String roomId
    ) {
        System.out.println("게임 시작 호출");
        ResponseStartGame response = cockroachService.startGame(roomId);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "카드 전달 (WebSocket)", description = "플레이어가 특정 대상에게 카드를 전달합니다.")
    @PostMapping("/give-card/{roomId}")
    public ResponseEntity<String> giveCard(
            @Parameter(description = "카드를 전달할 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody RequestGiveCard request
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/give-card/{roomId} 로 보내세요.");
    }

    @MessageMapping("/game/give-card/{roomId}")
    public void giveCardSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestGiveCard request
    ) {
        ResponseGiveCard response = cockroachService.giveCard(roomId, request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }


    @Operation(summary = "싱글 카드 확인 (WebSocket 예제)",
            description = "WebSocket을 사용하여 특정 방에서 카드 확인을 요청하는 예제 메시지를 제공합니다.")
    @GetMapping("/game/single-card/{roomId}")
    public ResponseEntity<String> singleCardExample(
            @Parameter(description = "방 ID", required = true) @PathVariable String roomId
    ) {
        String exampleMessage = """
        WebSocket 메시지 예제:
        {
            "roomId": "%s",
            "cardIndex": 2
        }
        WebSocket 주소: ws://localhost:8090/ws/game/single-card/{roomId}
        """.formatted(roomId);
        return ResponseEntity.ok(exampleMessage);
    }
    @MessageMapping("/game/single-card/{roomId}")
    public void singleCardSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestSingleCard request
    ) {
        ResponseCheckCard response = cockroachService.singleCard(roomId, request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }


    @Operation(summary = "멀티 카드 확인 (WebSocket 예제)",
            description = "WebSocket을 사용하여 특정 방에서 여러 개의 카드 확인을 요청하는 예제 메시지를 제공합니다.")
    @GetMapping("/game/multi-card/{roomId}")
    public ResponseEntity<String> multiCardExample(
            @Parameter(description = "방 ID", required = true) @PathVariable String roomId
    ) {
        String exampleMessage = """
        WebSocket 메시지 예제:
        {
            "roomId": "%s",
            "cards": [1, 3, 5]
        }
        WebSocket 주소: ws://localhost:8090/ws/game/multi-card/{roomId}
        """.formatted(roomId);
        return ResponseEntity.ok(exampleMessage);
    }
    @MessageMapping("/game/multi-card/{roomId}")
    public void multiCardSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestMultiCard request
    ) {
        ResponseMultiCard response = cockroachService.multiCard(roomId, request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "게임 방 나가기 (WebSocket)", description = "플레이어가 게임 방을 나갑니다.")
    @PostMapping("/exit-room/{roomId}")
    public ResponseEntity<String> exitRoom(
            @Parameter(description = "나갈 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody String userNickname
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/exit-room/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/exit-room/{roomId}")
    public void exitRoomSocket(
            @DestinationVariable String roomId,
            @RequestParam String userNickname
    ) {
        ResponseExitRoom response = cockroachService.exitRoom(roomId, userNickname);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "투표 요청 (WebSocket)", description = "플레이어가 특정 대상을 투표 대상으로 지정합니다.")
    @PostMapping("/send-vote/{roomId}")
    public ResponseEntity<String> sendVote(
            @Parameter(description = "투표가 진행될 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody RequestSendVote request
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/send-vote/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/send-vote/{roomId}")
    private void sendVoteSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestSendVote request
    ) {
        ResponseSendVote response = cockroachService.sendVote(roomId, request);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "투표 진행 (WebSocket 예제)",
            description = "WebSocket을 사용하여 특정 방에서 투표를 요청하는 예제 메시지를 제공합니다.")
    @GetMapping("/game/vote/{roomId}")
    public ResponseEntity<String> voteExample(
            @Parameter(description = "방 ID", required = true) @PathVariable String roomId
    ) {
        String exampleMessage = """
        WebSocket 메시지 예제:
        {
            "roomId": "%s",
            "playerId": 123,
            "vote": "yes"
        }
        WebSocket 주소: ws://localhost:8090/ws/game/vote/{roomId}
        """.formatted(roomId);
        return ResponseEntity.ok(exampleMessage);
    }

    @MessageMapping("/game/vote/{roomId}")
    private void vote(
            @DestinationVariable String roomId,
            @RequestBody RequestVote request
    ) {
        ResponseVote response = cockroachService.vote(request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }


    @Operation(summary = "투표 결과 전송 (WebSocket)", description = "투표 결과를 서버에서 클라이언트로 전송합니다.")
    @PostMapping("/vote-result/{roomId}")
    public ResponseEntity<String> voteResult(
            @Parameter(description = "투표 결과를 받을 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody RequestVoteResult request
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/vote-result/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/vote-result/{roomId}")
    private void voteResultSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestVoteResult request
    ) {
        ResponseCockroachVoteResult response = cockroachService.voteResult(roomId, request);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

    @Operation(summary = "손 패 체크", description = "패가 0장인지 확인합니다.")
    @PostMapping("/hand-check/{roomId}")
    public ResponseEntity<String> handCheck(
            @Parameter(description = "손 패 체크가 이루어질 방 ID", required = true)
            @PathVariable String roomId,
            @RequestBody RequestHandCheck request
    ) {
        return ResponseEntity.ok("WebSocket 요청을 ws://localhost:8090/ws/game/hand-check/{roomId} 로 보내세요.");
    }
    @MessageMapping("/game/hand-check/{roomId}")
    private void handCheckSocket(
            @DestinationVariable String roomId,
            @RequestBody RequestHandCheck request
    ) {
        ResponseHandCheck response = cockroachService.handCheck(roomId, request);

        messagingTemplate.convertAndSend("/topic/game/" + roomId, response);
    }

}
