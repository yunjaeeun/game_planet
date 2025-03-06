package com.meeple.meeple_back.admin.ai.service;

import com.meeple.meeple_back.admin.ai.model.entity.VoiceLog;
import com.meeple.meeple_back.admin.ai.model.request.RequestLogin;
import com.meeple.meeple_back.admin.ai.model.request.RequestProcessVoiceLog;
import com.meeple.meeple_back.admin.ai.model.response.*;
import com.meeple.meeple_back.admin.ai.repo.VoiceLogRepository;
import com.meeple.meeple_back.aws.s3.service.S3Service;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class AIServiceImpl implements AIService {
    private static final String ROOM_KEY = "AI_APP_STATUS";
    private final UserRepository userRepository;
    private final VoiceLogRepository voiceLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;
    private final S3Service s3Service;


    /* redis에 클라이언트 켜짐 추가 */
    @Override
    public ResponseLogin login(RequestLogin request) {
        User user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 이메일입니다."));

        if (passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            System.out.println("일치");
            ResponseLogin response = ResponseLogin.builder()
                    .isSuccess(true)
                    .userId(user.getUserId())
                    .userNickname(user.getUserNickname())
                    .build();

            redisTemplate.opsForHash().put(ROOM_KEY, user.getUserNickname(), "ON");

            return response;
        } else {
            System.out.println("불일치");
            ResponseLogin response = ResponseLogin.builder()
                    .isSuccess(false)
                    .build();

            return response;
        }
    }

    @Override
    public ResponseVoiceLogList voiceLogList() {
        List<VoiceLog> voiceLogList = voiceLogRepository.findAll();

        ResponseVoiceLogList response = ResponseVoiceLogList.builder()
                .code(200)
                .message("정상 작동")
                .voiceLogList(voiceLogList)
                .build();

        return response;
    }

    @Override
    public ResponseVoiceLog voiceLog(long voiceLogId) {
        VoiceLog voiceLog = voiceLogRepository.findById(voiceLogId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 음성 로그입니다."));

        ResponseVoiceLog response = ResponseVoiceLog.builder()
                .code(200)
                .message("정상 작동")
                .voiceLog(voiceLog)

                .build();
        return response;
    }

    @Override
    public ResponseProcessVoiceLog processVoiceLog(RequestProcessVoiceLog request) {
        VoiceLog voiceLog = voiceLogRepository.findById(request.getVoiceLogId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 음성 로그입니다."));

        if (request.getVoiceLogProcessStatus().equals("BAN")) {
            User user = userRepository.findById(voiceLog.getUser().getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원입니다."));

            user.setUserDeletedAt(LocalDateTime.now());

            voiceLog.setVoiceProcessStatus("Y");

            userRepository.save(user);
        }
        voiceLog.setVoiceProcessStatus("Y");
        VoiceLog savedVoiceLog = voiceLogRepository.save(voiceLog);

        ResponseProcessVoiceLog response = ResponseProcessVoiceLog.builder()
                .code(200)
                .message("처리완료")
                .voiceLog(savedVoiceLog)
                .build();

        return response;
    }

    @Override
    public ResponseLogout logout(String userNickname) {
        redisTemplate.opsForHash().delete(ROOM_KEY, userNickname);
        ResponseLogout response = ResponseLogout.builder()
                .code(200)
                .message("로그아웃 성공")
                .build();

        return response;
    }

    @Override
    public ResponseCreateVoiceLog createVoiceLog(MultipartFile audio, String convertResult,
                                                 String userNickname) {
        User user = userRepository.findByUserNickname(userNickname);

        String fileUrl = s3Service.uploadFile(audio);

        VoiceLog voiceLog = new VoiceLog();
        voiceLog.setUser(user);
        voiceLog.setVoiceLog(convertResult);
        voiceLog.setVoiceTime(LocalDateTime.now());
        voiceLog.setVoiceProcessStatus("N");
        voiceLog.setVoiceFileUrl(fileUrl);

        VoiceLog savedvoiceLog = voiceLogRepository.save(voiceLog);

        ResponseCreateVoiceLog response = ResponseCreateVoiceLog.builder()
                .code(200)
                .message("저장 성공")
                .voiceLog(savedvoiceLog)
                .build();

        return response;
    }
}
