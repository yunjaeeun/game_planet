package com.meeple.meeple_back.admin.ai.repo;

import com.meeple.meeple_back.admin.ai.model.entity.VoiceLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoiceLogRepository extends JpaRepository<VoiceLog, Long> {

}
