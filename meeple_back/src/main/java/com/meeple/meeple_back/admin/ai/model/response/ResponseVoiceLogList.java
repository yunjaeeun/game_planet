package com.meeple.meeple_back.admin.ai.model.response;

import com.meeple.meeple_back.admin.ai.model.entity.VoiceLog;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResponseVoiceLogList {
    private int code;
    private String message;
    private List<VoiceLog> voiceLogList;
}
