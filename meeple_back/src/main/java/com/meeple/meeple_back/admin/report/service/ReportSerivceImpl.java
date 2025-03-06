package com.meeple.meeple_back.admin.report.service;

import com.meeple.meeple_back.admin.report.model.ReportResult;
import com.meeple.meeple_back.admin.report.model.entity.Report;
import com.meeple.meeple_back.admin.report.model.entity.ReportProcess;
import com.meeple.meeple_back.admin.report.model.request.RequestCreateReport;
import com.meeple.meeple_back.admin.report.model.request.RequestProcessReport;
import com.meeple.meeple_back.admin.report.model.request.RequestUpdateProcess;
import com.meeple.meeple_back.admin.report.model.response.ResponseCreateReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseProcessReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReportList;
import com.meeple.meeple_back.admin.report.model.response.ResponseUpdateProcess;
import com.meeple.meeple_back.admin.report.repo.ReportProcessRepository;
import com.meeple.meeple_back.admin.report.repo.ReportRepository;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ReportSerivceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportProcessRepository reportProcessRepository;
    private final ModelMapper mapper;

    @Override
    public ResponseCreateReport createReport(RequestCreateReport request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원(신고 대상"));

        User reporter = userRepository.findById(request.getReporterId())
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원(신고자"));

        Report report = Report.builder()
            .reportTime(LocalDateTime.now())
            .reportReason(request.getReportReason())
            .reportTitle(request.getReportTitle())
            .reportContent(request.getReportContent())
            .processStatus("WAIT")
            .user(user)
            .reporter(reporter)
            .build();

        reportRepository.save(report);

        ResponseCreateReport response = ResponseCreateReport.builder()
            .code(200)
            .message(user.getUserNickname() + "에 대한 신고가 정상적으로 접수되었습니다.")
            .build();

        return response;
    }

    @Override
    public List<ResponseReportList> findReportList() {
        List<Report> reportList = reportRepository.findAll();

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        return reportList.stream().map(report -> mapper
            .map(report, ResponseReportList.class))
            .collect(Collectors.toList());
    }

    @Override
    public ResponseReport findReport(int reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 신고입니다."));

        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        ResponseReport response = mapper.map(report, ResponseReport.class);

        return response;
    }

    @Override
    public ResponseProcessReport processReport(RequestProcessReport request) {
        Report report = reportRepository.findById(request.getReportId())
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 신고입니다."));


        if (request.getReportResult().equals("PASS")) {
            report.setProcessStatus("PASS");
            reportRepository.save(report);

            ResponseProcessReport response = ResponseProcessReport.builder()
                .code(200)
                .message("(상태: 무혐의) 정상적으로 처리 됐습니다.")
                .build();
            return response;
        } else if (request.getReportResult().equals("WARNING")) {
            ReportProcess reportProcess = ReportProcess.builder()
                .reportResult(ReportResult.WARNING)
                .reportProcessTime(LocalDateTime.now())
                .report(report)
                .reportedUser(report.getUser())
                .build();
            reportProcessRepository.save(reportProcess);

            report.setProcessStatus("WARNING");
            reportRepository.save(report);

            ResponseProcessReport reponse = ResponseProcessReport.builder()
                .code(200)
                .message("(상태: 경고) 정상적으로 처리 됐습니다.")
                .build();

            return reponse;
        } else if (request.getReportResult().equals("BAN")) {
            ReportProcess reportProcess = ReportProcess.builder()
                .reportResult(ReportResult.BAN)
                .reportProcessTime(LocalDateTime.now())
                .report(report)
                .reportedUser(report.getUser())
                .build();

            report.getUser().setUserDeletedAt(LocalDateTime.now());
            userRepository.save(report.getUser());
            reportProcessRepository.save(reportProcess);

            report.setProcessStatus("BAN");
            reportRepository.save(report);

            ResponseProcessReport reponse = ResponseProcessReport.builder()
                .code(200)
                .message("(상태: 영구제한) 정상적으로 처리 됐습니다.")
                .build();

            return reponse;
        } else {
            ResponseProcessReport reponse = ResponseProcessReport.builder()
                .code(500)
                .message("신고 처리가 실패했습니다.")
                .build();

            return reponse;
        }
    }

    @Override
    public ResponseUpdateProcess updateProcess(RequestUpdateProcess request) {
        ReportProcess reportProcess = reportProcessRepository.findById(request.getReportProcessId())
            .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 신고 처리"));

        if (request.getReportResult().equals("PASS")) {
            Report report = reportProcess.getReport();

            report.setProcessStatus("PASS");

            if (report.getUser().getUserDeletedAt() != null) {
                User user = report.getUser();
                user.setUserDeletedAt(null);
                userRepository.save(user);
            }

            reportProcessRepository.delete(reportProcess);

            reportRepository.save(report);

            ResponseUpdateProcess response = ResponseUpdateProcess.builder()
                .code(200)
                .message("(상태: 무혐의) 정상적으로 처리 됐습니다.")
                .build();
            return response;
        } else if (request.getReportResult().equals("WARNING")) {
            reportProcess.setReportResult(ReportResult.WARNING);
            reportProcessRepository.save(reportProcess);

            Report report = reportProcess.getReport();

            if (report.getUser().getUserDeletedAt() != null) {
                User user = report.getUser();
                user.setUserDeletedAt(null);
                userRepository.save(user);
            }

            report.setProcessStatus("WARNING");
            reportRepository.save(report);

            ResponseUpdateProcess reponse = ResponseUpdateProcess.builder()
                .code(200)
                .message("(상태: 경고) 정상적으로 처리 됐습니다.")
                .build();

            return reponse;
        } else if (request.getReportResult().equals("BAN")) {

            Report report = reportProcess.getReport();

            User user = report.getUser();
            user.setUserDeletedAt(LocalDateTime.now());
            userRepository.save(user);

            report.setProcessStatus("BAN");
            reportRepository.save(report);

            reportProcess.setReportResult(ReportResult.BAN);
            reportProcessRepository.save(reportProcess);
            ResponseUpdateProcess reponse = ResponseUpdateProcess.builder()
                .code(200)
                .message("(상태: 영구제한) 정상적으로 처리 됐습니다.")
                .build();

            return reponse;
        } else {
            ResponseUpdateProcess reponse = ResponseUpdateProcess.builder()
                .code(500)
                .message("처리 불가 백엔드 오류")
                .build();

            return reponse;
        }
    }
}
