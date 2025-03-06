package com.meeple.meeple_back.admin.report.model.entity;

import com.meeple.meeple_back.admin.report.model.ReportReason;
import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_report")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private int reportId;

    @Column(name = "report_time")
    private LocalDateTime reportTime;

    @Column(name = "report_reason")
    @Enumerated(EnumType.STRING)
    private ReportReason reportReason;

    @Column(name = "report_title")
    private String reportTitle;

    @Column(name = "report_content")
    private String reportContent;

    @Column(name = "process_status")
    private String processStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

}
