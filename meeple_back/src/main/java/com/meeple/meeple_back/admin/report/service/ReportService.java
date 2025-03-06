package com.meeple.meeple_back.admin.report.service;

import com.meeple.meeple_back.admin.report.model.request.RequestCreateReport;
import com.meeple.meeple_back.admin.report.model.request.RequestProcessReport;
import com.meeple.meeple_back.admin.report.model.request.RequestUpdateProcess;
import com.meeple.meeple_back.admin.report.model.response.ResponseCreateReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseProcessReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReport;
import com.meeple.meeple_back.admin.report.model.response.ResponseReportList;
import com.meeple.meeple_back.admin.report.model.response.ResponseUpdateProcess;
import java.util.List;

public interface ReportService {

    ResponseCreateReport createReport(RequestCreateReport request);

    List<ResponseReportList> findReportList();

    ResponseReport findReport(int reportId);

    ResponseProcessReport processReport(RequestProcessReport request);

    ResponseUpdateProcess updateProcess(RequestUpdateProcess request);
}
