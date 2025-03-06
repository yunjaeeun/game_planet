package com.meeple.meeple_back.gameInfo.model.response.community;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ResponseDeleteComment {
    @Schema(description = "상태코드", example = "200")
    private int code;
    @Schema(description = "메세지", example = "성공적으로 업데이트 됨")
    private String message;
    @Schema(description = "삭제일", example = "2024-12-12")
    private Date deletedDate;
}
