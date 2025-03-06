package com.meeple.meeple_back.admin.report.model.response;

import com.meeple.meeple_back.admin.report.model.ReportReason;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ResponseReport {
    @Schema(description = "신고 PK", example = "1")
    private int reportId;
    @Schema(description = "신고 일자", example = "20240123T011023")
    private LocalDateTime reportTime;
    @Schema(description = "신고 사유", example = "CHAT")
    private ReportReason reportReason;
    @Schema(description = "신고 제목", example = "부적절한 내용")
    private String reportTitle;
    @Schema(description = "신고 내용", example = "부적절한 내용이라 신고합니다")
    private String reportContent;
    @Schema(description = "신고 대상", example = "{userId: 1, userName: 홍길동, ...}")
    private User user;
    @Schema(description = "신고자", example = "{userId: 2, userName: 유관순, ...}")
    private User reporter;
}
