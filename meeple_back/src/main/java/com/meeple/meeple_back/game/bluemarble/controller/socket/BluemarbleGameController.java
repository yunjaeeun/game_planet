package com.meeple.meeple_back.game.bluemarble.controller.socket;

import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleGameService;
import com.meeple.meeple_back.game.bluemarble.controller.request.DiceRollRequest;
import com.meeple.meeple_back.game.bluemarble.controller.response.BuildBaseResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.DrawCardResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.GamePlayResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.BuildBaseRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.BuyLandRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.CardDrawRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.DiceRollBroadcastRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.PayFeeRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.TurnEndRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.PayFeeResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.SocketBuyLandResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.SocketDiceRollResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.SocketResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.TurnEndResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name = "게임플레이(블루마블)")
@Builder
@RequiredArgsConstructor
@MessageMapping("/game/blue-marble/game-plays")
public class BluemarbleGameController {

	private final Logger logger = LoggerFactory.getLogger(BluemarbleGameController.class);
	private final SimpMessageSendingOperations messagingTemplate;
	private final BluemarbleGameService bluemarbleGameService;

	@MessageMapping("/{roomId}/roll-dice")
	@Operation(summary = "주사위 굴리기", description = "주사위를 굴립니다.")
	public void rollDice(@DestinationVariable("roomId") int roomId,
			@Payload DiceRollRequest diceRollRequest) {
		SocketDiceRollResponse socketDiceRollResponse = SocketDiceRollResponse.from("roll-dice",
				bluemarbleGameService.rollDice(roomId, diceRollRequest), "주사위를 굴렸습니다.");
		logger.info("socketDiceRollResponse : {}", socketDiceRollResponse);
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketDiceRollResponse);
	}

	@MessageMapping("/{roomId}/buy-land")
	@Operation(summary = "땅 구매", description = "땅을 구매합니다.")
	public void buyLand(@DestinationVariable("roomId") int roomId,
			@Payload BuyLandRequest buyLandRequest) {
		logger.info("buyLandRequest : {}", buyLandRequest);
		SocketBuyLandResponse socketBuyLandResponse = SocketBuyLandResponse.from("buy-land",
				bluemarbleGameService.buyLand(roomId, buyLandRequest), "땅을 구매했습니다.");
		logger.info("socketBuyLandResponse : {}", socketBuyLandResponse);
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketBuyLandResponse);
	}

	@MessageMapping("/{roomId}/draw-card")
	@Operation(summary = "카드 뽑기", description = "카드를 뽑습니다.")
	public void drawCard(@DestinationVariable("roomId") int roomId,
			@Payload CardDrawRequest cardDrawRequest) {
		// TODO : 카드 뽑기 구현
		SocketResponse<DrawCardResponse> socketCardDrawResponse = SocketResponse.from("draw-card",
				bluemarbleGameService.drawCard(roomId, cardDrawRequest), "카드를 뽑았습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketCardDrawResponse);
	}

	@MessageMapping("/{roomId}/build-base")
	@Operation(summary = "기지 건설", description = "기지를 건설합니다.")
	public void buildBase(@DestinationVariable("roomId") int roomId,
			@Payload BuildBaseRequest buildBaseRequest) {
		SocketResponse<BuildBaseResponse> socketBuildBaseResponse = SocketResponse.from(
				"build-base",
				bluemarbleGameService.buildBase(roomId, buildBaseRequest), "기지를 건설했습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, socketBuildBaseResponse);

	}

	/**
	 * 통행료 지불 하는 기능
	 *
	 * @param roomId
	 * @param payFeeRequest - playerId, tileId
	 */
	@MessageMapping("/{roomId}/pay-fee")
	@Operation(summary = "통행료 지불", description = "통행료를 지불합니다")
	public void payFee(@DestinationVariable("roomId") int roomId,
			@Payload PayFeeRequest payFeeRequest) {
		SocketResponse<PayFeeResponse> response = SocketResponse.from("pay-fee",
				bluemarbleGameService.payFee(roomId, payFeeRequest), "통행료를 지불했습니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, response);
	}

	/**
	 * 주사위 더블인경우 다음 액션은 주사위 던지기.
	 * <p>
	 * 턴을 종료하고 종료 조건 판별 턴 종료 1. 4명이 게임할 경우 1
	 * <p>
	 * 말판에 우주기지 6개를 먼저 건설한 여행자가 승리합니다. (2명이 게임할 경우 우주기지 10개, 3명이 게임할경우 우주기지 8개를 먼저 건설한 여행자가 승리합니다.)
	 * <p>
	 * 1. 4명이 게임할 경우 2
	 * <p>
	 * 2명이 파산을 하게되면 게임이 즉시 끝나고 보유한 재산이 많은 여행자가 승리합니다.
	 * <p>
	 * (증서, 우주기지, 보유한 현금의 합)
	 *
	 * @param roomId
	 * @param turnEndRequest -
	 */
	@MessageMapping("/{roomId}/check-end")
	@Operation(summary = "턴을 끝내는 기능", description = "턴을 끝냅니다.")
	public void turnEnd(@DestinationVariable("roomId") int roomId,
			@Payload TurnEndRequest turnEndRequest) {
		SocketResponse<TurnEndResponse> response = SocketResponse.from("turn-end",
				bluemarbleGameService.turnEnd(roomId, turnEndRequest), "턴을 종료합니다");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, response);
	}

	@MessageMapping("/{roomId}/just-roll-dice")
	@Operation(summary = "주사위 굴리기 방송", description = "주사위 굴리는걸 방송하는 기능")
	public void justRollDice(@DestinationVariable("roomId") int roomId,
			@Payload DiceRollBroadcastRequest request) {
		SocketResponse<DiceRollBroadcastRequest> response = SocketResponse.from("just-roll-dice",
				request,
				"주사위를 굴립니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, response);
	}

	/**
	 * 턴 시작하는 기능, 현재 라운드, 턴수, 플레이어 목록 등 게임관련된 모든 정보를 반환한다 return에 다음 기능 -> 주사위 굴리기로 정한다.
	 *
	 * @param roomId
	 */
	@MessageMapping("/{roomId}/start-turn")
	@Operation(summary = "턴 시작", description = "턴을 시작합니다.")
	public void startTurn(@DestinationVariable("roomId") int roomId) {
		SocketResponse<GamePlayResponse> response = SocketResponse.from("start-turn",
				bluemarbleGameService.startTurn(roomId), "턴을 시작합니다.");
		messagingTemplate.convertAndSend("/topic/rooms/" + roomId, response);
	}

}