package com.meeple.meeple_back.game.catchmind.model.response;

import com.meeple.meeple_back.game.catchmind.model.RoomInfoDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseUpdateRoom {
    @Schema(description = "메세지 타입", example = "updateRoom", required = true)
    private String type;
    @Schema(description = "방 생성자 닉네임", example = "gameMaster", required = true)
    private RoomInfoDTO roomInfo;
}
