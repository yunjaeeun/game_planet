package com.meeple.meeple_back.gameInfo.model.response.gameInfo;

import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseGameInfoList {
    @Schema(description = "게임 정보 목록", example = "[{gameInfoId:1, ...}, {}, {}]")
    List<GameInfo> gameInfoList;
}
