package com.meeple.meeple_back.admin.ai.model.entity;

import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_voice_log")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VoiceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voice_log_id")
    private long voiceLogId;

    @Column(name = "voice_log")
    private String voiceLog;

    @Column(name = "voice_time")
    private LocalDateTime voiceTime;

    @Column(name = "voice_file_url")
    private String voiceFileUrl;

    @Column(name = "voice_process_status")
    private String voiceProcessStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
