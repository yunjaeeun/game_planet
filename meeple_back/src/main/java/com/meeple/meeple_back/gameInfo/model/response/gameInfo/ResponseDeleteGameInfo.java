package com.meeple.meeple_back.gameInfo.model.response.gameInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseDeleteGameInfo {
    private int code;
    private String message;
}
