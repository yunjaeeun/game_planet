package com.meeple.meeple_back.user.handler;

import com.meeple.meeple_back.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtLogoutHandler implements LogoutHandler {

	private final JwtUtil jwtUtil;

	@Override
	public void logout(HttpServletRequest request,
			HttpServletResponse response,
			Authentication authentication) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);

			jwtUtil.blacklistToken(token);
		}


	}

}
