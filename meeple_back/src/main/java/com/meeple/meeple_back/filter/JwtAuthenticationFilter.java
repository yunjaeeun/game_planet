package com.meeple.meeple_back.filter;

import com.meeple.meeple_back.user.service.CustomUserDetailsService;
import com.meeple.meeple_back.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
* 모든 요청에 대해 JWT를 검사해서 인증 정보를 설정하는 필터
*/
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService = userDetailsService;
	}

	/**
	 * [JWT 검증 및 인증] - 요청 헤더에서 JWT를 추출하고, 유효성을 검증한 후, SecurityContext에 인증 정보를 설정.
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {
		try {
			String jwt = resolveToken(request);

			if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
				String email = jwtUtil.getUsernameFromToken(jwt);

				UserDetails userDetails = userDetailsService.loadUserByUsername(email);

				UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(
								userDetails, null, userDetails.getAuthorities()
						);

				authentication.setDetails(
						new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		} catch (ExpiredJwtException e) {
			logger.warn("JWT token has expired: {}");
		} catch (Exception e) {
			logger.error("Could not set user authentication: {}");
		}

		filterChain.doFilter(request, response);
	}

	/**
	 * [토큰 추출 메서드] - "Bearer "로 시작하는 Authorization 헤더에서 토큰을 추출.
	 */
	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7); // "Bearer " 제거
		}
		return null;
	}
}