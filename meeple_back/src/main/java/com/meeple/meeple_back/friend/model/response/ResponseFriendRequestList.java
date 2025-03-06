package com.meeple.meeple_back.friend.model.response;

import com.meeple.meeple_back.friend.dto.FriendRequestListDTO;
import com.meeple.meeple_back.friend.model.entity.Friend;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseFriendRequestList {
    @Schema(description = "요청 보낸 목록", example = "[{friendId: 1, ...}, {}, ...]")
    private List<Friend> requestingList;

    @Schema(description = "요청 받은 목록", example = "[{friendId: 1, ...}, {}, ...]")
    private List<Friend> requestedList;
}
