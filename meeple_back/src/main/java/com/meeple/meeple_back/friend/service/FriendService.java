package com.meeple.meeple_back.friend.service;

import com.meeple.meeple_back.friend.model.request.RequestFriend;
import com.meeple.meeple_back.friend.model.request.RequestProcess;
import com.meeple.meeple_back.friend.model.request.RequestProcessBlock;
import com.meeple.meeple_back.friend.model.request.RequestSendFriendMessage;
import com.meeple.meeple_back.friend.model.response.*;

import java.util.List;

public interface FriendService {
    List<ResponseFriendList> findFriendList(long userId);

    ResponseFriend requestFriend(RequestFriend request);

    ResponseFriendProcess processRequest(RequestProcess request);

    ResponseProcessBlock processBlock(RequestProcessBlock request);

    ResponseDeleteFriend deleteFriend(int friendId);

    ResponseSendFriendMessage sendMessage(RequestSendFriendMessage request);

    List<ResponseFriendMessageList> getMessageList(long userId);

    ResponseSearchUser searchUser(String userNickName);

    ResponseFriendRequestList friendRequestList(long userId);

    List<ResponseFriendList> findBlockingList(long userId);

    ResponseDeleteFriendRequest deleteFriendRequest(int friendId);

    ResponseDeleteMessage deleteMesasge(int friendMessageId);
}
