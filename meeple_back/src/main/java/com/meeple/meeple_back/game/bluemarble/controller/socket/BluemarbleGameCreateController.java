package com.meeple.meeple_back.game.bluemarble.controller.socket;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleGameService;
import com.meeple.meeple_back.game.bluemarble.controller.response.GamePlayResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.SocketResponse;
import com.meeple.meeple_back.game.bluemarble.domain.GamePlayCreate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@Tag(name = "게임플레이(블루마블) 생성")
@Builder
@RequiredArgsConstructor
@MessageMapping("/game/blue-marble/game-plays")
public class BluemarbleGameCreateController {

	private final BluemarbleGameService bluemarbleGameService;
	private final SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/create")
	@Operation(summary = "부루마불 환경이 생성됐습니다.", description = "게임환경을 생성합니다.")
	public void create(@RequestBody GamePlayCreate gamePlayCreate) {
		SocketResponse<GamePlayResponse> socketGamePlayResponse = SocketResponse.from(
				"create",
				bluemarbleGameService.create(gamePlayCreate),
				"부루마불 환경이 생성되었습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + gamePlayCreate.getGamePlayId(),
				socketGamePlayResponse);
	}
}
