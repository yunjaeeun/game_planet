package com.meeple.meeple_back.admin.report.repo;

import com.meeple.meeple_back.admin.report.model.entity.ReportProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportProcessRepository extends JpaRepository<ReportProcess, Integer> {

}
