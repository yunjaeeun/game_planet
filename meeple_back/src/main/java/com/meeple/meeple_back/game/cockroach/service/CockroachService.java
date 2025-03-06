package com.meeple.meeple_back.game.cockroach.service;

import com.meeple.meeple_back.game.cockroach.model.request.*;
import com.meeple.meeple_back.game.cockroach.model.response.*;

public interface CockroachService {

    ResponseStartGame startGame(String roomId);

    ResponseGiveCard giveCard(String roomId, RequestGiveCard request);

    ResponseCheckCard singleCard(String roomId, RequestSingleCard request);

    ResponseMultiCard multiCard(String roomId, RequestMultiCard request);

    void sendMessage(String roomId, RequestSendMessage request);

    ResponseExitRoom exitRoom(String roomId, String userNickname);

    ResponseSendVote sendVote(String roomId, RequestSendVote request);

    ResponseVote vote(RequestVote request);

    ResponseCockroachVoteResult voteResult(String roomId, RequestVoteResult request);

    ResponseHandCheck handCheck(String roomId, RequestHandCheck request);


//    ResponseGuessCard guessCard(String roomId, RequestGuessCard request);

    ResponseUpdateRoom updateRoom(String roomId, RequestUpdateRoom request);

}
