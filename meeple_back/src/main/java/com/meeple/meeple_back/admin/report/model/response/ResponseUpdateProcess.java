package com.meeple.meeple_back.admin.report.model.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseUpdateProcess {
    @Schema(description = "상태코드", example = "200")
    private int code;
    @Schema(description = "처리 메세지", example = "메세지")
    private String message;
}
