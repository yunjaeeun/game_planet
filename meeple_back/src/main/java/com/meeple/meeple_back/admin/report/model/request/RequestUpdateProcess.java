package com.meeple.meeple_back.admin.report.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestUpdateProcess {
    @Schema(description = "신고 처리 PK", example = "1")
    private int reportProcessId;
    @Schema(description = "처리 결과", example = "BAN")
    private String reportResult;

}
