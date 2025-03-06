package com.meeple.meeple_back.util;

import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private final int validity = 1000 * 60 * 60 * 4; // 4시간
	private final UserRepository userRepository;

	@Value("${jwt.secret}")
	private String SECRET_KEY;

	private final RedisTemplate<String, String> redisTemplate;

	@Autowired
	public JwtUtil(@Qualifier("userRedisTemplate") RedisTemplate<String, String> redisTemplate,
			UserRepository userRepository) {
		this.redisTemplate = redisTemplate;
		this.userRepository = userRepository;
	}

	/**
	 * [JWT 생성 메서드] - userEmail로 사용자를 찾아 userId를 subject로 설정 - 토큰 유효시간 4시간으로 설정
	 */
	public String generateToken(String userEmail) {
		long now = System.currentTimeMillis();
		Key key = getSigningKey();

		User user = userRepository.findByUserEmail(userEmail)
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		return Jwts.builder()
				.setSubject(String.valueOf(user.getUserId()))  // userId를 String으로 변환하여 subject에 저장
				.setIssuedAt(new Date(now))
				.setExpiration(new Date(now + validity))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	public static String generateToken(Long userId, String username) {
		long now = System.currentTimeMillis();
		Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
		return Jwts.builder()
				.setSubject(String.valueOf(userId))
				.claim("username", username)
				.setIssuedAt(new Date(now))
				.setExpiration(new Date(now + 1000 * 60 * 60 * 4))
				.signWith(key)
				.compact();
	}

	/**
	 * [JWT 검증 메서드] - parseClaimsJws 메서드로 서명 및 만료 시간 등을 검증한다.
	 */
	public boolean validateToken(String token) {
		try {
			if (isTokenBlacklisted(token)) {
				return false;
			}
			Jwts.parserBuilder()
					.setSigningKey(getSigningKey())
					.build()
					.parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	/**
	 * [사용자명 추출] - 토큰의 subject에서 userId를 추출 - userId로 사용자를 찾아 email 반환
	 */
	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		Long userId = Long.parseLong(claims.getSubject());  // subject(userId)를 Long으로 변환

		// userId로 사용자를 찾아서 email 반환
		return userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found"))
				.getUserEmail();
	}

	public Long getUserIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		return Long.parseLong(claims.getSubject());
	}

	/**
	 * [Key 객체 생성 메서드] - 비밀 키를 디코딩하고 Key 객체로 변환.
	 */
	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public void blacklistToken(String token) {
		redisTemplate.opsForValue()
				.set(token, "true", validity, TimeUnit.MILLISECONDS);
	}

	public boolean isTokenBlacklisted(String token) {
		return redisTemplate.hasKey(token);
	}
}
