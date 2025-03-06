package com.meeple.meeple_back.game.openVidu.service;

import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import io.openvidu.java.client.TokenOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

/**
 * OpenVidu 서버와의 통신을 담당하는 서비스 클래스 화상 채팅 세션 관리와 토큰 발급을 처리합니다.
 */
@Service
public class OpenViduService {

	private OpenVidu openVidu;
	// OpenVidu 서버 접속 정보
	private static final String OPENVIDU_URL = "https://boardjjigae.duckdns.org:8443/";
	private static final String SECRET = "MY_SECRET";

	/**
	 * 서비스 초기화 메서드 Spring Boot 애플리케이션 시작 시 자동으로 실행됩니다.
	 */
	@PostConstruct
	public void init() {
		try {
			// OpenVidu 서버 연결을 위한 환경 설정
			System.setProperty("OPENVIDU_URL", OPENVIDU_URL);
			System.setProperty("OPENVIDU_SECRET", SECRET);

			this.openVidu = new OpenVidu(OPENVIDU_URL, SECRET);
		} catch (Exception e) {
			throw new RuntimeException("Failed to initialize OpenVidu", e);
		}
	}

	/**
	 * 새로운 화상 채팅 세션을 생성합니다.
	 *
	 * @return 생성된 세션의 ID
	 */
	public String createSession() throws OpenViduJavaClientException, OpenViduHttpException {
		try {
			// 랜덤한 세션 ID를 가진 새로운 세션 생성
			SessionProperties properties = new SessionProperties.Builder()
					.customSessionId("ses_" + generateRandomString())
					.build();
			Session session = this.openVidu.createSession(properties);
			return session.getSessionId();
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 특정 세션에 접속하기 위한 토큰을 생성합니다.
	 *
	 * @param sessionId 접속할 세션의 ID
	 * @return 생성된 접속 토큰
	 */
	public String generateToken(String sessionId)
			throws OpenViduJavaClientException, OpenViduHttpException {
		try {
			Session session = null;
			try {
				// 새로운 세션 생성 시도
				session = this.openVidu.createSession(new SessionProperties.Builder()
						.customSessionId(sessionId)
						.build());
			} catch (OpenViduHttpException e) {
				// 409 에러는 이미 세션이 존재한다는 의미
				if (e.getStatus() == 409) {
					// 기존 활성 세션 중에서 요청된 sessionId와 일치하는 세션을 찾음
					session = this.openVidu.getActiveSessions()
							.stream()
							.filter(s -> s.getSessionId().equals(sessionId))
							.findFirst()
							.orElseThrow(
									() -> new RuntimeException("Session not found: " + sessionId));
				} else {
					throw e;
				}
			}

			// 발행자(PUBLISHER) 권한을 가진 토큰 생성
			TokenOptions tokenOptions = new TokenOptions.Builder()
					.role(OpenViduRole.PUBLISHER)
					.data("")  // 추가적인 사용자 데이터가 필요한 경우 여기에 설정
					.build();
			String token = session.generateToken(tokenOptions);
			return token;
		} catch (Exception e) {
			throw e;
		}
	}

	/**
	 * 랜덤한 세션 ID 생성을 위한 유틸리티 메서드
	 *
	 * @return 10자리의 랜덤한 문자열
	 */
	private String generateRandomString() {
		String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		StringBuilder random = new StringBuilder();
		for (int i = 0; i < 10; i++) {
			random.append(CHARACTERS.charAt((int) (Math.random() * CHARACTERS.length())));
		}
		return random.toString();
	}
}