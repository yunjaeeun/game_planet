package com.meeple.meeple_back.game.bluemarble.domain;

import com.meeple.meeple_back.game.bluemarble.controller.request.DiceRollRequest;
import com.meeple.meeple_back.game.bluemarble.controller.response.BuildBaseResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.BuyLandResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.DiceRollResponse;
import com.meeple.meeple_back.game.bluemarble.controller.response.DrawCardResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.request.*;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.PayFeeResponse;
import com.meeple.meeple_back.game.bluemarble.controller.socket.response.TurnEndResponse;
import com.meeple.meeple_back.game.bluemarble.util.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Getter
@Builder
@Data
public class GamePlay {

	private final int gamePlayId;
	private List<Player> players;
	private String gameStatus;
	private int round;
	private List<Tile> board;
	private List<Card> cards;
	private TurnManager turnManager;

	@Builder
	public static GamePlay init(GamePlayCreate gamePlayCreate, List<Player> players) {
		return GamePlay.builder()
				.gamePlayId(gamePlayCreate.getGamePlayId())
				.players(players)
				.gameStatus(GameStatus.IN_PROGRESS.getStatus())
				.round(1)
				.board(createTiles())
				.cards(createCards())
				.turnManager(TurnManager.init(players))
				.build();
	}

	private static List<Card> createCards() {

		ExcelReader<SeedCertificateCard> seedCertificateCardParser = new SeedCertificateCardParser();
		List<SeedCertificateCard> seedCards = seedCertificateCardParser.readExcelFile();
		List<TelepathyCard> telepathyCards = new TelepathyCardParser().readExcelFile();
		List<NeuronsValleyCard> neuronsValleyCards = new NeuronsValleyParser().readExcelFile();
		List<Card> cards = new ArrayList<>();
		cards.addAll(seedCards);
		cards.addAll(telepathyCards);
		cards.addAll(neuronsValleyCards);
//		for (int i = 0; i <= 37; i++) {
//			SeedCertificateCard card = new SeedCertificateCard(
//					i,
//					i,// id
//					"Seed Certificate Card " + i,                  // name
//					"Color" + (i % 5 + 1),
//					// cardColor (예: Color1 ~ Color5)
//					i * 10,
//					// seedCount (예시: 10, 20, 30, ...)
//					"This is a description for card number " + i,  // description
//					100 + i * 10,
//					// baseConstructionCost (예: 110, 120, 130, ...)
//					50 + i * 5,
//					// headquartersUsageFee (예: 55, 60, 65, ...)
//					20 + i * 2
//					// baseUsageFee (예: 22, 24, 26, ...)
//			);
//			cards.add(card);
//		}

		return cards;
	}

	public static GamePlay copyObject(GamePlay gamePlay) {
		return GamePlay.builder()
				.gamePlayId(gamePlay.getGamePlayId())
				.players(gamePlay.getPlayers())
				.gameStatus(gamePlay.getGameStatus())
				.round(gamePlay.getRound())
				.board(gamePlay.getBoard())
				.cards(gamePlay.getCards())
				.turnManager(gamePlay.getTurnManager())
				.build();
	}

	/**
	 * 특정 카드 번호, card Type으로 카드 찾아서 추가
	 *
	 * @param cardNumber 카드 번호
	 * @param cardType   카드 타입 (SEED_CERTIFICATE_CARD, TELEPATHY_CARD, NEURONS_VALLEY_CARD)
	 * @return Card
	 */
	private Card findAndRemoveCardByNumberAndType(int cardNumber, CardType cardType) {
		Card card = cards.stream()
				.filter(c -> c.getNumber() == cardNumber && c.checkType(cardType))
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Card not found"));
		cards.remove(card);
		return card;
	}

	private Tile findTileById(int tileId) {
		return board.stream()
				.filter(tile -> tile.getId() == tileId)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Tile not found"));
	}

	private static List<Tile> createTiles() {
		ExcelReader<Tile> tileParser = new TileParser();
		return tileParser.readExcelFile();

//		for (int i = 0; i <= 40; i++) {
//			Tile tile = new Tile(
//					i,                                        // id
//					"Tile " + i,                              // name
//					0,                                        // owner (0은 미소유)
//					i * 50,                                   // toll (예시로 i에 따라 증가)
//					false,                                    // hasBase (기본값: 없음)
//					TileType.SEED_CERTIFICATE_CARD,
//					"image:url",                                   // price (예시로 i에 따라 증가),
//					1 + i * 10
//			);
//			tiles.add(tile);
//		}
	}

	private Optional<Player> findPlayerById(int playerId) {
		return players.stream()
				.filter(player -> player.getPlayerId() == playerId)
				.findFirst();
	}

	private Player getValidatedPlayer(int playerId) {
		return findPlayerById(playerId)
				.orElseThrow(() -> new IllegalArgumentException("Player not found"));
	}

	/**
	 * 더블이면 더블 Count ++
	 */
	private void processDoubleRoll(DiceRollResult response) {
		if (response.isDouble()) {
			turnManager.checkDouble();
		}
	}

	public DiceRollResponse rollDices(DiceRollRequest diceRollRequest) {
		Player currentPlayer = getValidatedPlayer(diceRollRequest.getPlayerId());
		DiceRollResult response = currentPlayer.rollDices(diceRollRequest);
		processDoubleRoll(response);

		int currentPosition = response.getNextPosition();
		ActionType nextAction = processTileEvent(currentPlayer, currentPosition);
		// TODO 2 : 턴 종료 조건 판별
		return DiceRollResponse.from(response, nextAction);
	}

	private ActionType processTileEvent(Player currentPlayer, int currentPosition) {
		Tile currentTile = board.stream()
				.filter(tile -> tile.getId() == currentPosition)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Tile not found"));
		// 행성에 도착할 경우.
		if (TileType.SEED_CERTIFICATE_CARD == currentTile.getType()) {
			return processLandingOnPlanetEvent(currentPlayer, currentTile);
		}
		// TODO 3: 특수카드일 경우 처리
		if (TileType.NEURONS_VALLEY_CARD == currentTile.getType()) {

		}

		return ActionType.CHECK_END;
	}

	/**
	 * 땅에 도착했을 때 이벤트 처리 1. 땅이 비어있으면 구매할지 물어보기 2. 땅이 다른 플레이어 소유이면 통행료 지불 3. 땅이 자신의 땅이면 기지 건설할지 물어보기
	 *
	 * @param currentPlayer - 현재 플레이어
	 * @param currentTile   - 현재 타일
	 *                      <p>
	 *                      return - 다음 액션
	 */
	private ActionType processLandingOnPlanetEvent(Player currentPlayer, Tile currentTile) {
		// 기지 구매할지 물어보도록 액션 추가
		final int EMPTY_TILE_OWNER_NUMBER = 0;

		if (currentTile.getOwnerId() == currentPlayer.getPlayerId() && !currentTile.isHasBase()) {
			return ActionType.DO_YOU_WANT_TO_BUILD_THE_BASE;
		}

		// 땅 살건지 물어보는 액션 추가
		if (currentTile.getOwnerId() == EMPTY_TILE_OWNER_NUMBER
				&& currentPlayer.getBalance() >= currentTile.getPrice()) {
			return ActionType.DO_YOU_WANT_TO_BUY_THE_LAND;
		}

		// 통행료 지불 하도록 액션 추가
		if (currentTile.getOwnerId() != EMPTY_TILE_OWNER_NUMBER
				&& currentTile.getOwnerId() != currentPlayer.getPlayerId()) {
			return determineBrokenOnPayFee(currentPlayer, currentTile);
		}
		// 턴 끝났는지 확인
		return ActionType.ROLL_DICE;
	}

	private ActionType determineBrokenOnPayFee(Player player, Tile currentTile) {
		if (player.getBalance() < currentTile.getTollPrice()) {
			return ActionType.BROKEN;
		}
		return ActionType.PAY_TOLL;
	}

	/**
	 * 플레이어가 땅 구매하는 메서드
	 *
	 * @param buyLandRequest - playerid, titleId, action
	 * @return BuyLandResponse - playerId, action, prevMoney, updatedMoney, updatedTile
	 */
	public BuyLandResponse buyLand(BuyLandRequest buyLandRequest) {
		int tileId = buyLandRequest.getTileId();
		Player currentPlayer = getValidatedPlayer(buyLandRequest.getPlayerId());
		Tile tile = board.stream()
				.filter(t -> t.getId() == tileId)
				.findFirst()
				.orElseThrow(() -> new IllegalArgumentException("Tile not found"));

		if (tile.getOwnerId() != 0) {
			throw new IllegalArgumentException("Tile already owned");
		}

		if (tile.getType() != TileType.SEED_CERTIFICATE_CARD) {
			throw new IllegalArgumentException("Tile is not a seed certificate card");
		}

		// 원래 금액
		int prevMoney = currentPlayer.getBalance();

		// 플레이어 땅 금액 지불
		currentPlayer.payMoney(tile.getPrice());

		// 카드 덱에서 카드 찾고 제거
		SeedCertificateCard card = (SeedCertificateCard) findAndRemoveCardByNumberAndType(tileId,
				CardType.SEED_CERTIFICATE_CARD);

		// 타일 정보 업데이트
		tile.update(currentPlayer.getPlayerId(), card.getBaseUsageFee(),
				card.getBaseConstructionCost());

		// 플레이어 땅 소유 추가
		currentPlayer.addLandOwned(tileId);
		// 플레이어 카드 소유 추가
		currentPlayer.addCardOwned(card);

		return BuyLandResponse.of(currentPlayer.getPlayerId(), prevMoney,
				currentPlayer.getBalance(),
				currentPlayer, tile, ActionType.CHECK_END);
	}


	/**
	 * 타일에 해당하는 카드 뽑기 카드 종류 : 텔레파시, 뉴런의 골짜기, 미완
	 *
	 * @param cardDrawRequest - playerId, tileId
	 * @return DrawCardResponse - playerId, action, card
	 */
	public DrawCardResponse drawCard(CardDrawRequest cardDrawRequest) {

		Player player = getValidatedPlayer(cardDrawRequest.getPlayerId());

		Tile tile = findTileById(cardDrawRequest.getTileId());
		// 타일 타입별로 카드 뽑기
		TileType tileType = tile.getType();
		if (tileType == TileType.TELEPATHY_CARD) {
			// 텔레파시 카드 뽑기
			TelepathyCard card = (TelepathyCard) findAndRemoveCardByNumberAndType(tile.getId(),
					CardType.TELEPATHY_CARD);
			player.addCardOwned(card);
			return DrawCardResponse.from(player.getPlayerId(), player, card, ActionType.CHECK_END,
					getCards());
		}

		if (tileType == TileType.NEURONS_VALLEY_CARD) {
			// 뉴런의 골짜기 카드 뽑기
			NeuronsValleyCard card = (NeuronsValleyCard) findAndRemoveCardByNumberAndType(tile.getId(),
					CardType.NEURONS_VALLEY_CARD);
			player.addCardOwned(card);
			return DrawCardResponse.from(player.getPlayerId(), player, card, ActionType.CHECK_END,
					getCards());
		}
		return DrawCardResponse.from(player.getPlayerId(), player, null, ActionType.CHECK_END,
				getCards());
	}

	/**
	 * 기지 건설 ( 땅 도착 -> 자신의 땅 -> 기지 없음 -> 기지 건설)
	 * <p>
	 * 기지 통행료 업데이트, 기지 건설 비용 지불
	 *
	 * @param buildBaseRequest -playerId, tileId
	 * @return BuildBaseResponse - playerId, action, prevMoney, updatedMoney, updatedTile
	 */
	public BuildBaseResponse buildBase(BuildBaseRequest buildBaseRequest) {
		Player player = getValidatedPlayer(buildBaseRequest.getPlayerId());
		Tile tile = findTileById(buildBaseRequest.getTileId());

		if (tile.getOwnerId() != player.getPlayerId()) {
			throw new IllegalArgumentException("Player의 땅이 아닙니다.");
		}

		if (tile.isHasBase()) {
			throw new IllegalArgumentException("이미 기지가 존재합니다");
		}
		SeedCertificateCard card = (SeedCertificateCard) player.getCardOwnedByTileId(
				buildBaseRequest.getTileId());

		int baseBuildFee = card.getBaseConstructionCost();
		int headquarterUsageFee = card.getHeadquartersUsageFee();

		if (player.getBalance() < baseBuildFee) {
			throw new IllegalArgumentException("Player의 자금이 부족합니다");
		}

		int prevPlayerMoney = player.getBalance();
		player.payMoney(baseBuildFee);
		int updatedMoney = player.getBalance();

		tile.addBase();
		tile.updateTollPrice(headquarterUsageFee);

		return BuildBaseResponse.from(player.getPlayerId(), prevPlayerMoney, updatedMoney, player,
				tile, ActionType.CHECK_END);
	}

	/**
	 * 통행료 지불 하는 기능 ( 상대방 타일에 도착, 플레이어 자금이 충분하면 통행료 지불, 없으면 파산?
	 *
	 * @param payFeeRequest - playerId, tileId
	 * @return PayFeeResponse - private int prevMoney; private int updatedMoney; private int
	 * tollPrice; private boolean playerBrokenState; private Player paidPlayer; private Player
	 * receivedPlayer; private String nextAction;
	 */
	public PayFeeResponse payFee(PayFeeRequest payFeeRequest) {
		Tile tile = findTileById(payFeeRequest.getTileId());
		Player paidPlayer = getValidatedPlayer(payFeeRequest.getPlayerId());
		validateTileOwnership(tile, paidPlayer);
		Player receivedPlayer = getValidatedPlayer(tile.getOwnerId());

		int tollPrice = tile.getTollPrice();

		if (tollPrice > paidPlayer.getBalance()) {
			return handleInsufficientBalance(paidPlayer, receivedPlayer, tollPrice);
		} else {
			return handleSufficientBalance(paidPlayer, receivedPlayer, tollPrice);
		}
	}

	private PayFeeResponse handleInsufficientBalance(Player paidPlayer, Player receivedPlayer,
	                                                 int tollPrice) {
		final int availablePayment = paidPlayer.getBalance();
		final int remainingToll = tollPrice - paidPlayer.getBalance();
		paidPlayer.payMoney(availablePayment);
		receivedPlayer.addMoney(availablePayment);
		paidPlayer.setBroken();
		return PayFeeResponse.from(availablePayment, paidPlayer.getBalance(), remainingToll, true,
				paidPlayer, receivedPlayer, ActionType.CHECK_END);
	}

	private PayFeeResponse handleSufficientBalance(Player paidPlayer, Player receivedPlayer,
	                                               int tollPrice) {
		final int previousBalance = paidPlayer.getBalance();

		paidPlayer.payMoney(tollPrice);
		receivedPlayer.addMoney(tollPrice);

		return PayFeeResponse.from(previousBalance, paidPlayer.getBalance(), tollPrice, false,
				paidPlayer, receivedPlayer, ActionType.CHECK_END);
	}

	private void validateTileOwnership(Tile tile, Player payer) {
		if (tile.getOwnerId() == 0) {
			throw new IllegalArgumentException("주인 없는 땅입니다.");
		}
		if (tile.getOwnerId() == payer.getPlayerId()) {
			throw new IllegalArgumentException("플레이어가 땅의 주인입니다.");
		}
	}

	/**
	 * 턴 종료, 게임 종료 조건 확인, 게임 결과 리턴.
	 *
	 * @param turnEndRequest
	 * @return
	 */
	public TurnEndResponse turnEnd(TurnEndRequest turnEndRequest) {
		return turnManager.endTurn(board);
	}
}