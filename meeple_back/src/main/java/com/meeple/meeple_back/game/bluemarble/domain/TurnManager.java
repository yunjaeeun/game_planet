package com.meeple.meeple_back.game.bluemarble.domain;

import com.meeple.meeple_back.game.bluemarble.controller.socket.response.TurnEndResponse;
import lombok.Getter;
import org.springframework.data.annotation.PersistenceConstructor;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;

/**
 * 턴 관리 클래스. 플레이어 순서를 관리하고, 더블 카운트, 현재 라운드를 관리한다.
 */

/**
 * 턴 종료할지 확인. 주사위 더블이면 한턴 더 파산한 사람있으면 플레이어에서 제외 라운드 계산
 * <p>
 * <p>
 * 4명이 플레이 할 경우 (1.  우주기지 6개 먼저 건설한 사람이 승리 2. 2명이 파산하면 게임 즉시 끝나고 보유한 재산이 많은 사람이 승리) 3명이 플레이 할 경우 (1.
 * 우주기지 8개 먼저 건설한 사람이 승리 2. 1명이 파산하면 게임 즉시 끝나고 보유한 재산이 많은 사람이 승리) 2명이 플레이할 경우 (1. 우주기지 10개 먼저 건설한
 * 사람이 승리 2. 1명이 파산하면 게임 즉시 끝나고 보유한 재산이 많은 사람이 승리)
 * <p>
 * 재산 : 증서, 우주기지, 보유한 현금의 합
 * <p>
 * 리턴하는거 -> 게임 끝남 (다음 액션 : 승자 정보 가져오기) , 다음 턴 - 해당 플레이어가 파산한 경우(파산한 플레이어, 다음턴 플레이어, 턴 정보 리턴, 다음 액션:
 * ROLL_DICE), 주사위 더블인 경우(주사위 더블인 플레이어 주기, 다음 액션 : ROLL_DICE)
 */
@Getter
public class TurnManager {

	private static Logger logger = Logger.getLogger(TurnManager.class.getName());
	private int initialPlayerCount;
	private List<Player> players;
	private int doubleCount;
	private int round;
	private int currentPlayerIndex;

	public TurnManager() {
	}

	@PersistenceConstructor
	private TurnManager(List<Player> players, int doubleCount, int round,
	                    int currentPlayerIndex) {
		this.players = players;
		this.doubleCount = doubleCount;
		this.round = round;
		this.currentPlayerIndex = currentPlayerIndex;
		this.initialPlayerCount = players.size();
	}


	public static TurnManager init(List<Player> players) {
		return new TurnManager(new ArrayList<>(players), 0, 1, 0);
	}

	public Player nextTurn() {
		if (players.isEmpty()) {
			return null;
		}
		if (currentPlayerIndex + 1 >= players.size()) {
			round++;
		}
		currentPlayerIndex = (currentPlayerIndex + 1) % players.size();

		return players.get(currentPlayerIndex);
	}


	public boolean checkDoubleState() {
		return doubleCount >= 1;
	}

	/**
	 * 턴 끝내기. 턴 끝내는 조건 확인하고 다음턴 준비하기.
	 */
	public synchronized TurnEndResponse endTurn(List<Tile> board) {
		if (checkWinnerByPlayerSize()) {
			return TurnEndResponse.gameEnd(determineWinner(board));
		}

		if (rolledDouble()) {
			doubleCount = 2;
			return TurnEndResponse.diceDoubleOneMoreTurn(getCurrentPlayer(), currentPlayerIndex,
					round);
		}
		doubleCount = 0;

		if (hasMetConstructionWinCondition(getCurrentPlayer(), board)) {
			return TurnEndResponse.gameEnd(getCurrentPlayer());
		}

		if (isCurrentPlayerBankrupt()) {
			return handleBankruptCurrentPlayer(board);
		}

		Player nextPlayer = nextTurn();

		return TurnEndResponse.nextTurn(null, nextPlayer, currentPlayerIndex, round,
				ActionType.START_TURN);
	}

	/**
	 * 파산한 플레이어의 땅 소유주를 없앤다.
	 *
	 * @param board
	 * @return
	 */
	private TurnEndResponse handleBankruptCurrentPlayer(List<Tile> board) {

		Player removed = getCurrentPlayer();
		board.forEach(tile -> {

			if (tile.getOwnerId() == removed.getPlayerId()) {
				tile.initialize();
			}
		});
		removePlayer(removed);

		if (checkWinnerByPlayerSize()) {
			return TurnEndResponse.gameEnd(determineWinner(board));
		}
		Player nextPlayer = nextTurn();
		return TurnEndResponse.nextTurn(removed, nextPlayer, currentPlayerIndex, round,
				ActionType.START_TURN);
	}

	/**
	 * 파산으로 게임이 끝나야 하는지 확인. 4 -> 2명 3 -> 1명 2 -> 1명
	 *
	 * @return
	 */
	private boolean checkWinnerByPlayerSize() {

		if (initialPlayerCount == 4) {
			return players.size() <= 2;
		} else if (initialPlayerCount == 3) {
			return players.size() <= 1;
		} else if (initialPlayerCount == 2) {
			return players.size() <= 1;
		}
		return false;
	}


	/**
	 * 건설 승리 조건을 만족했는지 확인.
	 * <p>
	 * 4명이 플레이 할 경우 (1.  우주기지 6개 먼저 건설한 사람이 승리 ) * 3명이 플레이 할 경우 (1. 우주기지 8개 먼저 건설한 사람이 승리) * 2명이
	 * 플레이할 경우 (1. 우주기지 10개 먼저 건설한 사람이 승리)
	 *
	 * @param currentPlayer
	 * @return
	 */
	private boolean hasMetConstructionWinCondition(Player currentPlayer, List<Tile> board) {
		int currentPlayerBaseCount = (int) board.stream()
				.filter(tile -> tile.getOwnerId() == currentPlayer.getPlayerId()
						&& tile.isHasBase())
				.count();
		if (initialPlayerCount == 4) {
			return currentPlayerBaseCount >= 6;
		} else if (initialPlayerCount == 3) {
			return currentPlayerBaseCount >= 8;
		} else if (initialPlayerCount == 2) {
			return currentPlayerBaseCount >= 10;
		}
		return false;
	}

	// TODO 3: 승자를 결정한다.

	/**
	 * 승자를 결정한다. 남은 플레이어 중에서 재산이 가장 많은 플레이어 결정
	 *
	 * @return
	 */
	private Player determineWinner(List<Tile> board) {
		// 재산이 가장 큰 플레이어를 찾습니다.
		return players.stream()
				.max(Comparator.comparingLong(player -> player.calculateTotalAsset(board)))
				.orElse(null); // 플레이어가 없으면 null 리턴
	}


	public void removePlayer(Player player) {
		int index = players.indexOf(player);
		if (index != -1) {
			players.remove(index);
			if (index < currentPlayerIndex) {
				currentPlayerIndex--;
			}
			if (currentPlayerIndex >= players.size()) {
				currentPlayerIndex = 0;
				this.round++;
			}
		}
	}

	private boolean isCurrentPlayerBankrupt() {
		return players.get(currentPlayerIndex).isBankrupt();
	}

	private boolean rolledDouble() {
		return doubleCount == 1;
	}


	public void checkDouble() {
		this.doubleCount++;

	}

	private Player getCurrentPlayer() {
		return players.get(currentPlayerIndex);
	}
}
