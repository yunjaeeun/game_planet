package com.meeple.meeple_back.game.catchmind.service;

import com.meeple.meeple_back.game.catchmind.model.GameResultDTO;
import com.meeple.meeple_back.game.catchmind.model.request.*;
import com.meeple.meeple_back.game.catchmind.model.response.*;

import java.util.List;
import java.util.Map;

public interface CatchMindService {
    ResponseCreateRoom createRoom(RequestCreateRoom request);

    ResponseJoinRoom joinRoom(RequestJoinRoom request);

    List<Map<String, Object>> getList();

    void deleteRoom(String roomId);

    ResponseStartGame startGame(String roomId);

    ResponseSendMessage sendMessage(String roomId, RequestSendMessage request);

//    ResponseQuiz requestQuiz(String roomId);

    ResponseSendVote sendVote(String roomId, RequestSendVote request);

    ResponseVote vote(RequestVote request);

    ResponseVoteResult voteResult(String roomId, RequestVoteResult request);

    List<GameResultDTO> gameResult(String roomId);

    ResponseUpdateRoom updateRoom(String roomId, RequestUpdateRoom request);

    ResponseExitCatchmindRoom exitRoom(String roomId, String userName);

    ResponseTimeOut quizTimeOut(String roomId);

    ResponseCatchMindReady readyRoom(String roomId, RequestCatchMindReady request);
}

