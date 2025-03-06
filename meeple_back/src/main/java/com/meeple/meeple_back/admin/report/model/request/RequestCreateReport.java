package com.meeple.meeple_back.admin.report.model.request;

import com.meeple.meeple_back.admin.report.model.ReportReason;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class RequestCreateReport {
    @Schema(description = "신고 사유", example = "CHAT", required = true)
    private ReportReason reportReason;
    @Schema(description = "신고 제목", example = "부적절한 내용", required = true)
    private String reportTitle;
    @Schema(description = "신고 내용", example = "부적절한 내용이라 신고합니다", required = true)
    private String reportContent;
    @Schema(description = "신고 대상 PK", example = "2", required = true)
    private long userId;
    @Schema(description = "신고자 PK", example = "1", required = true)
    private long reporterId;
}
