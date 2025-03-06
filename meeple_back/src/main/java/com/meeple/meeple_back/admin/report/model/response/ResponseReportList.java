package com.meeple.meeple_back.admin.report.model.response;

import com.meeple.meeple_back.admin.report.model.ReportReason;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseReportList {

    @Schema(description = "신고 PK", example = "1")
    private int reportId;
    @Schema(description = "신고 일자", example = "20240123T011023")
    private LocalDateTime reportTime;
    @Schema(description = "신고 사유", example = "CHAT")
    private ReportReason reportReason;
    @Schema(description = "신고 제목", example = "부적절한 내용신고")
    private String reportTitle;
}
