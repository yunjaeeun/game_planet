package com.meeple.meeple_back.game.bluemarble.controller.http;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleRoomService;
import com.meeple.meeple_back.game.bluemarble.controller.request.RoomUpdatePassword;
import com.meeple.meeple_back.game.bluemarble.controller.response.RoomResponse;
import com.meeple.meeple_back.game.bluemarble.domain.RoomUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "대기방(블루마블)")
@RestController
@RequestMapping("/game/blue-marble/rooms")
@Builder
@RequiredArgsConstructor
public class BluemarbleRoomController {

	private final BluemarbleRoomService bluemarbleRoomService;
	private final SimpMessageSendingOperations messagingTemplate;

	@GetMapping
	@Operation(summary = "대기방 목록 조회", description = "생성된 대기방 목록을 조회합니다.")
	public ResponseEntity<List<RoomResponse>> getRooms() {
		return ResponseEntity.status(HttpStatus.OK).body(bluemarbleRoomService.getList().stream()
				.map(RoomResponse::from).toList());
	}

	@GetMapping("/{searchName}/search")
	@Operation(summary = "대기방 이름으로 검색", description = "대기방 이름으로 검색합니다.")
	public ResponseEntity<List<RoomResponse>> searchRooms(@PathVariable String searchName) {
		return ResponseEntity.status(HttpStatus.OK)
				.body(bluemarbleRoomService.search(searchName).stream()
						.map(RoomResponse::from).toList());
	}


	@GetMapping("/{roomId}")
	@Operation(summary = "대기방 조회", description = "대기방을 조회합니다.")
	public ResponseEntity<RoomResponse> getRoom(@PathVariable int roomId) {
		return ResponseEntity.ok(RoomResponse.from(bluemarbleRoomService.findById(roomId)));
	}

	@PutMapping("/{roomId}")
	@Operation(summary = "대기방 수정", description = "대기방을 수정합니다.")
	public ResponseEntity<RoomResponse> update(@PathVariable int roomId,
			@Valid @RequestBody RoomUpdate roomUpdate) {
		return ResponseEntity.ok(
				RoomResponse.from(bluemarbleRoomService.update(roomId, roomUpdate)));
	}

	@DeleteMapping("/{roomId}/user/{userId}")
	@Operation(summary = "대기방 삭제", description = "대기방을 삭제합니다.")
	public ResponseEntity<RoomResponse> delete(@PathVariable int roomId,
			@PathVariable("userId") Long userId) {
		return ResponseEntity.status(HttpStatus.NO_CONTENT)
				.body(RoomResponse.from(bluemarbleRoomService.delete(roomId, userId)));
	}

	@PutMapping("/{roomId}/change-password")
	@Operation(summary = "대기방 비밀번호 변경", description = "대기방 비밀번호를 변경합니다.")
	public ResponseEntity<Void> changePassword(@PathVariable int roomId,
			@Valid @RequestBody RoomUpdatePassword roomUpdatePassword) {
		bluemarbleRoomService.changePassword(roomId, roomUpdatePassword);
		return ResponseEntity.ok().build();
	}


}
