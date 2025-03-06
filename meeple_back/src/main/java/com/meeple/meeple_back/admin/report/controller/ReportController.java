package com.meeple.meeple_back.admin.report.controller;

import com.meeple.meeple_back.admin.report.model.request.RequestCreateReport;
import com.meeple.meeple_back.admin.report.model.request.RequestProcessReport;
import com.meeple.meeple_back.admin.report.model.request.RequestUpdateProcess;
import com.meeple.meeple_back.admin.report.model.response.ResponseCreateReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseProcessReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReportList;
import com.meeple.meeple_back.admin.report.model.response.ResponseUpdateProcess;
import com.meeple.meeple_back.admin.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/report")
@AllArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "신고 등록", description = "신고를 등록합니다.")
    @PostMapping
    public ResponseEntity<ResponseCreateReport> createReport(
        @RequestBody RequestCreateReport request
    ) {
        ResponseCreateReport response = reportService.createReport(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "신고 목록 조회", description = "신고 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ResponseReportList>> findReportList() {
        List<ResponseReportList> response = reportService.findReportList();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "신고 단일 조회", description = "신고 상세 정보를 조회합니다.")
    @GetMapping("/{reportId}")
    public ResponseEntity<ResponseReport> findReport(
        @PathVariable int reportId
    ) {
        ResponseReport response = reportService.findReport(reportId);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "신고 처리", description = "신고를 처리합니다.")
    @PostMapping("/process-report")
    public ResponseEntity<ResponseProcessReport> processReport(
        @RequestBody RequestProcessReport request
    ) {
        ResponseProcessReport response = reportService.processReport(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PutMapping("/update-process")
    public ResponseEntity<ResponseUpdateProcess> updateProcess(
        @RequestBody RequestUpdateProcess request
    ) {
        ResponseUpdateProcess response = reportService.updateProcess(request);

        return ResponseEntity.ok(response);
    }



}
