package com.meeple.meeple_back.admin.ai.model.response;

import com.meeple.meeple_back.admin.ai.model.entity.VoiceLog;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResponseProcessVoiceLog {
    private int code;
    private String message;
    private VoiceLog voiceLog;
}
