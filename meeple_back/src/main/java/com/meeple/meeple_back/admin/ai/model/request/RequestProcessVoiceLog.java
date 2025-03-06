package com.meeple.meeple_back.admin.ai.model.request;

import lombok.Data;

@Data
public class RequestProcessVoiceLog {
    private long voiceLogId;
    private String voiceLogProcessStatus;
}
