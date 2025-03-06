package com.meeple.meeple_back.admin.ai.service;

import com.meeple.meeple_back.admin.ai.model.request.RequestLogin;
import com.meeple.meeple_back.admin.ai.model.request.RequestProcessVoiceLog;
import com.meeple.meeple_back.admin.ai.model.response.*;
import org.springframework.web.multipart.MultipartFile;

public interface AIService {
    ResponseLogin login(RequestLogin request);

    ResponseCreateVoiceLog createVoiceLog(MultipartFile audio,
        String convertResult, String userNickname);

    ResponseLogout logout(String userNickname);

    ResponseVoiceLogList voiceLogList();

    ResponseVoiceLog voiceLog(long voiceLogId);

    ResponseProcessVoiceLog processVoiceLog(RequestProcessVoiceLog request);
}
