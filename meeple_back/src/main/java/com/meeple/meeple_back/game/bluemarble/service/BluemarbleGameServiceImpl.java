package com.meeple.meeple_back.game.bluemarble.service;

import com.meeple.meeple_back.common.domain.exception.ResourceNotFoundException;
import com.meeple.meeple_back.game.bluemarble.controller.port.BluemarbleGameService;
import com.meeple.meeple_back.game.bluemarble.controller.request.DiceRollRequest;
import com.meeple.meeple_back.game.bluemarble.controller.response.BuildBaseResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.BuyLandResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.DiceRollResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.DrawCardResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.GamePlayResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.BuildBaseRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.BuyLandRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.CardDrawRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.PayFeeRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.TurnEndRequest;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.PayFeeResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.TurnEndResponse;
import com.meeple.meeple_back.game.bluemarble.domain.ActionType;
import com.meeple.meeple_back.game.bluemarble.domain.GamePlay;
import com.meeple.meeple_back.game.bluemarble.domain.GamePlayCreate;
import com.meeple.meeple_back.game.bluemarble.domain.Player;
import com.meeple.meeple_back.game.bluemarble.service.port.BluemarbleGameRepository;
import com.meeple.meeple_back.user.service.UserService;
import java.util.List;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BluemarbleGameServiceImpl implements BluemarbleGameService {

	private final static Logger logger = Logger.getLogger(
			BluemarbleGameServiceImpl.class.getName());
	private final BluemarbleGameRepository bluemarbleGameRepository;
	private final UserService userService;

	@Override
	@Transactional
	public GamePlayResponse create(GamePlayCreate gamePlayCreate) {
		List<Player> players = gamePlayCreate.getPlayerIds().stream()
				.map(id -> Player.init(userService.findById(id)))
				.toList();
		GamePlay gamePlay = bluemarbleGameRepository.save(GamePlay.init(gamePlayCreate, players));
		return GamePlayResponse.from(gamePlay, ActionType.START_TURN);
	}

	@Override
	public DiceRollResponse rollDice(int roomId, DiceRollRequest diceRollRequest) {
		GamePlay gamePlay = bluemarbleGameRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("GamePlay", roomId));
		DiceRollResponse diceRollResponse = gamePlay.rollDices(diceRollRequest);
		gamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(gamePlay);
		return diceRollResponse;
	}

	@Override
	public BuyLandResponse buyLand(int roomId, BuyLandRequest buyLandRequest) {
		GamePlay gamePlay = bluemarbleGameRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("GamePlay", roomId));
		BuyLandResponse response = gamePlay.buyLand(buyLandRequest);
		GamePlay newGamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(newGamePlay);
		return response;
	}

	@Override
	public DrawCardResponse drawCard(int roomId, CardDrawRequest cardDrawRequest) {
		GamePlay gamePlay = bluemarbleGameRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("GamePlay", roomId));
		DrawCardResponse response = gamePlay.drawCard(cardDrawRequest);
		gamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(gamePlay);
		return response;
	}

	@Override
	@Transactional
	public BuildBaseResponse buildBase(int roomId, BuildBaseRequest buildBaseRequest) {
		GamePlay gamePlay = getValidateGamePlay(roomId);
		BuildBaseResponse buildBaseResponse = gamePlay.buildBase(buildBaseRequest);
		gamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(gamePlay);
		return buildBaseResponse;
	}

	@Override
	@Transactional
	public PayFeeResponse payFee(int roomId, PayFeeRequest payFeeRequest) {
		GamePlay gamePlay = getValidateGamePlay(roomId);
		PayFeeResponse payFeeResponse = gamePlay.payFee(payFeeRequest);
		gamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(gamePlay);
		return payFeeResponse;
	}

	@Override
	@Transactional
	public TurnEndResponse turnEnd(int roomId, TurnEndRequest turnEndRequest) {
		GamePlay gamePlay = getValidateGamePlay(roomId);
		TurnEndResponse turnEndResponse = gamePlay.turnEnd(turnEndRequest);
		gamePlay = GamePlay.copyObject(gamePlay);
		bluemarbleGameRepository.save(gamePlay);
		return turnEndResponse;
	}

	@Override
	@Transactional
	public GamePlayResponse startTurn(int roomId) {
		GamePlay gamePlay = getValidateGamePlay(roomId);
		return GamePlayResponse.from(gamePlay, ActionType.ROLL_DICE);
	}


	private GamePlay getValidateGamePlay(int roomId) {
		return bluemarbleGameRepository.findById(roomId)
				.orElseThrow(() -> new ResourceNotFoundException("GamePlay", roomId));
	}
}
