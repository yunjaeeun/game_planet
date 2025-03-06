package com.meeple.meeple_back.friend.controller;

import com.meeple.meeple_back.friend.model.request.RequestFriend;
import com.meeple.meeple_back.friend.model.request.RequestProcess;
import com.meeple.meeple_back.friend.model.request.RequestProcessBlock;
import com.meeple.meeple_back.friend.model.request.RequestSendFriendMessage;
import com.meeple.meeple_back.friend.model.response.*;
import com.meeple.meeple_back.friend.service.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend")
@AllArgsConstructor
@Tag(name = "Friend", description = "친구 관련 API")
public class FriendController {
    private final FriendService friendService;

    @Operation(summary = "친구 목록 조회", description = "특정 사용자의 친구 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ResponseFriendList>> responseFriendList(
            @Parameter(description = "조회할 사용자의 ID", required = true)
            @RequestParam long userId
    ) {
        List<ResponseFriendList> response = friendService.findFriendList(userId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "친구 요청 보내기", description = "사용자가 친구 요청을 보냅니다.")
    @PostMapping("/request-friend")
    public ResponseEntity<ResponseFriend> requestFriend(
            @RequestBody RequestFriend request
    ) {
        ResponseFriend response = friendService.requestFriend(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "친구 요청 목록", description = "발송한 요청 목록, 발송 된 요청 목록을 조회합니다.")
    @GetMapping("/request-list")
    public ResponseEntity<ResponseFriendRequestList> responseFriendRequestList(
            @Parameter(description = "조회할 사용자의 ID", required = true)
            @RequestParam long userId
    ) {
        ResponseFriendRequestList response = friendService.friendRequestList(userId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "차단 목록", description = "차단한 유저 목록을 조회합니다.")
    @GetMapping("/blocking-list")
    public ResponseEntity<List<ResponseFriendList>> responseBlockingList(
            @Parameter(description = "조회할 사용자의 ID", required = true)
            @RequestParam long userId
    ) {
        List<ResponseFriendList> response = friendService.findBlockingList(userId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "친구 요청 처리", description = "친구 요청을 승인 또는 거절합니다.")
    @PutMapping("/process-request")
    public ResponseEntity<ResponseFriendProcess> processFriendRequest(
            @RequestBody RequestProcess request
    ) {
        ResponseFriendProcess response = friendService.processRequest(request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "차단 해제", description = "차단을 해제합니다.")
    @DeleteMapping("/process-block")
    public ResponseEntity<ResponseProcessBlock> processBlock(
            @RequestBody RequestProcessBlock request
    ) {
        ResponseProcessBlock response = friendService.processBlock(request);

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "친구 삭제", description = "특정 친구를 목록에서 삭제합니다.")
    @DeleteMapping("/delete-friend")
    public ResponseEntity<ResponseDeleteFriend> deleteFreind(
            @Parameter(description = "삭제할 친구의 PK(UserPK 아님)", required = true)
            @RequestParam int friendId
    ) {
        ResponseDeleteFriend response = friendService.deleteFriend(friendId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "친구 요청 삭제", description = "친구 요청을 삭제합니다.")
    @DeleteMapping("/delete-friend-request")
    public ResponseEntity<ResponseDeleteFriendRequest> deleteFriendRequest(
            @Parameter(description = "삭제알 친구 PK(UserPK 아님)", required = true)
            @RequestParam int friendId
    ) {
        ResponseDeleteFriendRequest response = friendService.deleteFriendRequest(friendId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "메세지 발송", description = "친구에게 쪽지를 발송합니다")
    @PostMapping("/message")
    public ResponseEntity<ResponseSendFriendMessage> sendMessage(
            @RequestBody RequestSendFriendMessage request
    ) {
        ResponseSendFriendMessage response = friendService.sendMessage(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "쪽지 삭제", description = "쪽지를 삭제합니다.")
    @DeleteMapping("/message")
    public ResponseEntity<ResponseDeleteMessage> deleteMessage(
            @Parameter(description = "조회할 쪽지의 PK", required = true)
            @RequestParam int friendMessageId
    ) {
        ResponseDeleteMessage response = friendService.deleteMesasge(friendMessageId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "쪽지 목록 조회", description = "쪽지 목록을 확인합니다")
    @GetMapping("/message")
    public ResponseEntity<List<ResponseFriendMessageList>> getMessageList(
            @Parameter(description = "조회할 사용자의 PK", required = true)
            @RequestParam long userId
    ) {
        List<ResponseFriendMessageList> response = friendService.getMessageList(userId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "닉네임으로 친구 검색", description = "닉네임으로 친구 추가할 유저를 찾습니다.")
    @GetMapping("/search")
    public ResponseEntity<ResponseSearchUser> searchUser(
            @RequestParam String userNickName
    ) {
        ResponseSearchUser response = friendService.searchUser(userNickName);

        return ResponseEntity.ok(response);
    }

}
