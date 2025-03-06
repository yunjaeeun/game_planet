package com.meeple.meeple_back.admin.report.model.entity;

import com.meeple.meeple_back.admin.report.model.ReportResult;
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
@Table(name = "tbl_report_process")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportProcess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportProcessId")
    private int reportProcessId;

    @Column(name = "report_process_time")
    private LocalDateTime reportProcessTime;

    @Column(name = "report_result")
    @Enumerated(EnumType.STRING)
    private ReportResult reportResult;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User reportedUser;
}
