package com.meeple.meeple_back.friend.service;

import com.meeple.meeple_back.friend.dto.SimpleUserDTO;
import com.meeple.meeple_back.friend.model.FriendStatus;
import com.meeple.meeple_back.friend.model.entity.Friend;
import com.meeple.meeple_back.friend.model.entity.FriendMessage;
import com.meeple.meeple_back.friend.model.request.RequestFriend;
import com.meeple.meeple_back.friend.model.request.RequestProcess;
import com.meeple.meeple_back.friend.model.request.RequestProcessBlock;
import com.meeple.meeple_back.friend.model.request.RequestSendFriendMessage;
import com.meeple.meeple_back.friend.model.response.*;
import com.meeple.meeple_back.friend.repository.FriendMessageRepository;
import com.meeple.meeple_back.friend.repository.FriendRepository;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final FriendMessageRepository friendMessageRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ModelMapper mapper;

    @Override
    public List<ResponseFriendList> findFriendList(long userId) {
        /* ACCEPTED인 상태 = 친구 승인 */
        List<Friend> friendList = friendRepository.findByUser_UserIdAndFriendStatus(userId, FriendStatus.ACCEPTED);

        List<ResponseFriendList> responseFriendList = friendList.stream()
                .map(friend -> {
                    ResponseFriendList response = new ResponseFriendList();
                    response.setFriendId(friend.getFriendId());
                    response.setFriendStatus(friend.getFriendStatus());
                    SimpleUserDTO userDTO = new SimpleUserDTO();
                    userDTO.setUserId(friend.getFriend().getUserId());
                    userDTO.setNickname(friend.getFriend().getUserNickname());
                    response.setFriend(userDTO); // friend 필드 (User 객체)
                    return response;
                })
                .collect(Collectors.toList());

        return responseFriendList;
    }

    @Override
    public ResponseFriendRequestList friendRequestList(long userId) {
        List<Friend> requestingList =
                friendRepository.findByUser_UserIdAndFriendStatus(userId, FriendStatus.PENDING); // 요청 보낸 목록
        List<Friend> requestedList =
                friendRepository.findByFriend_UserIdAndFriendStatus(userId, FriendStatus.PENDING); // 요청 받은 목록

        ResponseFriendRequestList response = ResponseFriendRequestList.builder()
                .requestingList(requestingList)
                .requestedList(requestedList)
                .build();

        return response;
    }

    @Override
    public List<ResponseFriendList> findBlockingList(long userId) {
        List<Friend> friendList = friendRepository.findByUser_UserIdAndFriendStatus(userId, FriendStatus.BLOCKING);

        List<ResponseFriendList> responseFriendList = friendList.stream()
                .map(friend -> {
                    ResponseFriendList response = new ResponseFriendList();
                    response.setFriendId(friend.getFriendId());
                    response.setFriendStatus(friend.getFriendStatus());
                    SimpleUserDTO userDTO = new SimpleUserDTO();
                    userDTO.setUserId(friend.getFriend().getUserId());
                    userDTO.setNickname(friend.getFriend().getUserNickname());
                    response.setFriend(userDTO); // friend 필드 (User 객체)
                    return response;
                })
                .collect(Collectors.toList());

        return responseFriendList;
    }

    @Override
    public ResponseFriend requestFriend(RequestFriend request) {
        User sender = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원입니다.(발송자)"));

        User target = userRepository.findById(request.getFriendId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원입니다.(대상)"));

        boolean exists = friendRepository.existsByUserAndFriend(sender, target);
        boolean exists2 = friendRepository.existsByUserAndFriend(target, sender);

        if (exists || exists2) {
            if (exists) {
                ResponseFriend response = ResponseFriend.builder()
                        .message("이미 요청을 보냈습니다.")
                        .build();

                return response;
            } else {
                ResponseFriend response = ResponseFriend.builder()
                        .message("상대방이 요청을 보냈거나 차단했습니다.")
                        .build();

                return response;
            }
        }

        Friend friend = Friend.builder()
                .user(sender)
                .friend(target)
                .friendStatus(FriendStatus.PENDING)
                .build();

        Friend savedFriendRequest = friendRepository.save(friend);

        ResponseFriend response = ResponseFriend.builder()
                .friendId(savedFriendRequest.getFriendId())
                .senderId(target.getUserId())
                .senderName(target.getUserNickname())
                .message(target.getUserNickname() + "님에게 친구 요청을 보내셨습니다.")
                .build();

        messagingTemplate.convertAndSend("/topic/user/" + target.getUserId(),
                sender.getUserNickname() + "님이 친구 요청을 보내셨습니다.");

        return response;
    }

    @Override
    public ResponseFriendProcess processRequest(RequestProcess request) {
        Friend friend = friendRepository.findById(request.getFriendId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 친구입니다."));

        if (request.getRequirements().equals("DENY")) {
            ResponseFriendProcess response = ResponseFriendProcess.builder()
                    .code(200)
                    .message(friend.getUser().getUserNickname() + "님이 보내신 친구 요청이 거절되었습니다.")
                    .build();

            friendRepository.delete(friend);

            return response;
        } else if (request.getRequirements().equals("ACCEPT")) {
            // 양방향 추가 친구 목록 둘 다 저장)
            friend.setFriendStatus(FriendStatus.ACCEPTED);

            friendRepository.save(friend);

            User target = friend.getUser();
            User sender = friend.getFriend();

            Friend newFriend = Friend.builder()
                    .user(sender)
                    .friend(target)
                    .friendStatus(FriendStatus.ACCEPTED)
                    .build();
            friendRepository.save(newFriend);

            ResponseFriendProcess response = ResponseFriendProcess.builder()
                    .code(201)
                    .message(friend.getUser().getUserNickname() + "님이 발송하신 친구 요청이 승인되었습니다.")
                    .build();

            messagingTemplate.convertAndSend("/topic/user" + friend.getUser().getUserId(),
                    friend.getFriend().getUserNickname() + "님에게 보내신 친구 요청이 승인되었습니다.");

            return response;
        } else if (request.getRequirements().equals("BLOCK")) {
            friend.setFriendStatus(FriendStatus.BLOCKED);

            friendRepository.save(friend);

            User target = friend.getUser();
            User sender = friend.getFriend();

            Friend newFriend = Friend.builder()
                    .user(sender)
                    .friend(target)
                    .friendStatus(FriendStatus.BLOCKING)
                    .build();
            friendRepository.save(newFriend);

            ResponseFriendProcess response = ResponseFriendProcess.builder()
                    .code(202)
                    .message(friend.getUser().getUserNickname() + "님이 차단되었습니다.")
                    .build();

            return response;
        } else {
            ResponseFriendProcess response = ResponseFriendProcess.builder()
                    .code(500)
                    .message("친구 요청 문제 발생 requirements를 다시 확인해주세요.")
                    .build();

            return response;
        }
    }

    @Override
    public ResponseProcessBlock processBlock(RequestProcessBlock request) {
        Friend friend = friendRepository.findById(request.getFriendId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 친구입니다."));

        long fromId = friend.getUser().getUserId();
        long targetId = friend.getFriend().getUserId();

        Friend friend1 = friendRepository.findByUser_UserIdAndFriend_UserId(targetId, fromId);

        friendRepository.delete(friend);
        friendRepository.delete(friend1);

        ResponseProcessBlock response = ResponseProcessBlock.builder()
                .code(200)
                .message("차단이 해제되었습니다.")
                .build();
        return null;
    }

    @Override
    public ResponseDeleteFriend deleteFriend(int friendId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 pk입니다."));

        long fromId = friend.getUser().getUserId();
        long targetId = friend.getFriend().getUserId();

        Friend friend1 = friendRepository.findByUser_UserIdAndFriend_UserId(targetId, fromId);

        friendRepository.delete(friend);
        friendRepository.delete(friend1);

        ResponseDeleteFriend response = ResponseDeleteFriend.builder()
                .code(200)
                .message("삭제되었습니다.")
                .build();

        return response;
    }

    @Override
    public ResponseDeleteFriendRequest deleteFriendRequest(int friendId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 pk입니다."));

        friendRepository.delete(friend);

        ResponseDeleteFriendRequest response = ResponseDeleteFriendRequest.builder()
                .code(200)
                .message("삭제되었습니다.")
                .build();

        return response;
    }

    @Override
    public ResponseSendFriendMessage sendMessage(RequestSendFriendMessage request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원"));

        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 발송자"));

        FriendMessage friendMessage = FriendMessage.builder()
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .user(user)
                .sender(sender)
                .build();

        friendMessageRepository.save(friendMessage);

        ResponseSendFriendMessage response = ResponseSendFriendMessage.builder()
                .code(200)
                .message("발송 성공")
                .build();

        messagingTemplate.convertAndSend("/topic/user" + user.getUserId()
                , sender.getUserNickname() + "님이 쪽지를 보내셨습니다.");

        return response;
    }

    @Override
    public ResponseDeleteMessage deleteMesasge(int friendMessageId) {
        FriendMessage friendMessage = friendMessageRepository.findById(friendMessageId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 쪽지입니다."));

        friendMessage.setDeletedAt(LocalDateTime.now());

        friendMessageRepository.save(friendMessage);

        ResponseDeleteMessage response = ResponseDeleteMessage.builder()
                .code(200)
                .message("성공적으로 삭제되었습니다.")
                .build();

        return response;
    }

    @Override
    public List<ResponseFriendMessageList> getMessageList(long userId) {
        List<FriendMessage> messageList = friendMessageRepository.findByUser_UserIdAndDeletedAtIsNull(userId);

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        return messageList.stream().map(message -> mapper
                        .map(message, ResponseFriendMessageList.class))
                .collect(Collectors.toList());
    }

    @Override
    public ResponseSearchUser searchUser(String userNickName) {
        try {
            User user = userRepository.findByUserNickname(userNickName);
            ResponseSearchUser response = ResponseSearchUser.builder()
                    .userId(user.getUserId())
                    .code(200)
                    .message("조회 성공")
                    .build();

            return response;
        } catch (Exception e) {
            ResponseSearchUser response = ResponseSearchUser.builder()
                    .code(400)
                    .message("존재하지 않는 닉네임입니다.")
                    .build();
        }
        ResponseSearchUser response = ResponseSearchUser.builder()
                .code(500)
                .message("조회 실패")
                .build();

        return response;
    }
}
