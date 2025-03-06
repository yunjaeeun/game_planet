package com.meeple.meeple_back.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenViduConfig {

	@PostConstruct
	public void init() {
		// SSL 인증서 검증 비활성화 (개발 환경에서만 사용)
		System.setProperty("javax.net.ssl.trustStore", "");
		System.setProperty("javax.net.ssl.trustStorePassword", "");
		System.setProperty("javax.net.ssl.trustStoreType", "JKS");
		System.setProperty("javax.net.debug", "ssl,handshake"); // SSL 디버깅 활성화

		// OpenVidu 서버 설정
		System.setProperty("OPENVIDU_URL", "https://boardjjigae.duckdns.org:8443/");
		System.setProperty("OPENVIDU_SECRET", "MY_SECRET");
	}
}