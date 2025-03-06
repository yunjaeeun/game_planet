package com.meeple.meeple_back.game.bluemarble.controller.socket;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleRoomService;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomJoinWithPassword;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomUpdatePassword;
import com.meeple.meeple_back.game.bluemarble.controller.response.RoomResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.SocketRoomResponse;
import com.meeple.meeple_back.game.bluemarble.domain.Message;
import com.meeple.meeple_back.game.bluemarble.domain.RoomUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Tag(name = "소켓 대기방(블루마블)")
@Controller
@MessageMapping("/game/blue-marble/rooms")
@Builder
@RequiredArgsConstructor
public class BluemarbleSocketRoomController {

	private final BluemarbleRoomService bluemarbleRoomService;
	private final SimpMessageSendingOperations messagingTemplate;

	@MessageMapping("/{roomId}/sendMessage")
	@Operation(summary = "메시지 전송", description = "메시지를 전송합니다.")
	public void sendMessage(@DestinationVariable("roomId") int roomId,
	                        @Payload Message message) {
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, message);
	}

	@MessageMapping("/{roomId}/user/{userId}/join")
	@Operation(summary = "대기방 참가", description = "대기방에 참가합니다.")
	public void join(@DestinationVariable("roomId") int roomId,
	                 @DestinationVariable("userId") long userId) {
		RoomResponse roomResponse = RoomResponse.from(bluemarbleRoomService.join(roomId, userId));
		SocketRoomResponse socketRoomResponse = SocketRoomResponse.of(roomResponse,
				"Player ID " + userId + " 님이 참가했습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId,
				socketRoomResponse);
	}

	@MessageMapping("/{roomId}/user/{userId}/private-room-join")
	@Operation(summary = "비밀 대기방 참가", description = "비밀 대기방에 참가합니다.")
	public void privateRoomJoin(@DestinationVariable("roomId") int roomId,
	                            @DestinationVariable("userId") int userId,
	                            @Payload RoomJoinWithPassword roomJoinWithPassword) {
		RoomResponse roomResponse = RoomResponse.from(
				bluemarbleRoomService.joinWithPassword(roomId, userId, roomJoinWithPassword));
		SocketRoomResponse socketRoomResponse = SocketRoomResponse.of(roomResponse,
				"Player ID " + userId + " 님이 참가했습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketRoomResponse);
	}

	@MessageMapping("/{roomId}/update")
	@Operation(summary = "소켓 대기방 업데이트", description = "대기방 정보를 업데이트합니다.")
	public void updateRoom(@DestinationVariable("roomId") int roomId,
	                       @Payload RoomUpdate roomUpdate) {
		RoomResponse roomResponse = RoomResponse.from(
				bluemarbleRoomService.update(roomId, roomUpdate));
		SocketRoomResponse socketRoomResponse = SocketRoomResponse.of(roomResponse,
				"대기방 정보가 업데이트 되었습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketRoomResponse);
	}

	@MessageMapping("/{roomId}/changePassword")
	@Operation(summary = "소켓 대기방 비밀번호 변경", description = "대기방의 비밀번호를 변경합니다.")
	public void changePassword(@DestinationVariable("roomId") int roomId,
	                           @Payload RoomUpdatePassword newPassword) {
		RoomResponse roomResponse = RoomResponse.from(
				bluemarbleRoomService.changePassword(roomId, newPassword));
		SocketRoomResponse socketRoomResponse = SocketRoomResponse.of(roomResponse,
				"대기방 비밀번호가 변경되었습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId,
				socketRoomResponse);
	}

	@MessageMapping("/{roomId}/user/{userId}/delete")
	@Operation(summary = "소켓 대기방 나가기", description = "대기방을 떠납니다.")
	public void deleteSocketCommunication(@DestinationVariable("roomId") int roomId,
	                                      @DestinationVariable("userId") Long userId) {
		RoomResponse roomResponse = RoomResponse.from(bluemarbleRoomService.delete(roomId, userId));
		SocketRoomResponse socketRoomResponse = SocketRoomResponse.of(roomResponse,
				"Player ID " + userId + " 님이 떠났습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketRoomResponse);
	}
}
