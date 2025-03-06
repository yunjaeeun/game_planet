package com.meeple.meeple_back.game.bluemarble.controller.socket;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleRoomService;
import com.meeple.meeple_back.game.bluemarble.controller.response.RoomResponse;
import com.meeple.meeple_back.game.bluemarble.domain.RoomCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "소켓 대기방(블루마블)")
@Controller
@MessageMapping("/game/blue-marble/rooms")
@Builder
@RequiredArgsConstructor
public class BluemarbleSocketRoomCreateController {

	private final SimpMessageSendingOperations messagingTemplate;
	private final BluemarbleRoomService bluemarbleRoomService;

	@MessageMapping("/{userId}")
	@Operation(summary = "소켓 대기방 참가", description = "대기방에 참가합니다.")
	public void join(@PathVariable Long userId, @RequestBody RoomCreate roomCreate) {
		RoomResponse roomResponse = RoomResponse.from(
				bluemarbleRoomService.create(userId, roomCreate));
		messagingTemplate.convertAndSend("/topic/rooms/" + roomResponse.getRoomId(), roomResponse);
	}
}
