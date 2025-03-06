package com.meeple.meeple_back.game.bluemarble.controller.http;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleRoomService;
import com.meeple.meeple_back.game.bluemarble.controller.response.RoomResponse;
import com.meeple.meeple_back.game.bluemarble.domain.RoomCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "대기방(블루마블)")
@RestController
@RequestMapping("/game/blue-marble/rooms")
@Builder
@RequiredArgsConstructor
public class BluemarbleRoomCreateController {

	private final BluemarbleRoomService bluemarbleRoomService;

	@PostMapping("/{userId}/create")
	@Operation(summary = "대기방 생성", description = "새로운 블루마블 대기방을 생성합니다.")
	public ResponseEntity<RoomResponse> create(@PathVariable Long userId,
			@Valid @RequestBody RoomCreate roomCreate) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(RoomResponse.from(bluemarbleRoomService.create(userId, roomCreate)));
	}
}
