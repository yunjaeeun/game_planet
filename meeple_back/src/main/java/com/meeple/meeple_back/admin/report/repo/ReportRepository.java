package com.meeple.meeple_back.admin.report.repo;

import com.meeple.meeple_back.admin.report.model.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

}
