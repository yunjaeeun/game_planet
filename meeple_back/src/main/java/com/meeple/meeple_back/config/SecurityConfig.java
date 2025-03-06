package com.meeple.meeple_back.config;

import com.meeple.meeple_back.filter.JwtAuthenticationFilter;
import com.meeple.meeple_back.user.handler.JwtLogoutHandler;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtLogoutHandler jwtLogoutHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers
						.frameOptions(frame -> frame.sameOrigin())
				)
				.sessionManagement(
						session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/ws/**", "/ws").permitAll()
                        .requestMatchers("/**").permitAll()
						.requestMatchers("/topic/**", "/queue/**", "/app/**").permitAll()  // STOMP 엔드포인트 추가
						.requestMatchers("/auth/login", "/user/register", "/user/checkEmail/**",
								"/user/checkNickname/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/profile/{userId}").permitAll()
						.requestMatchers(HttpMethod.PUT, "/profile/{userId}").authenticated()  // PUT 요청 허용
						.requestMatchers(HttpMethod.PUT, "/profile/{userId}/password").permitAll()
						.requestMatchers(HttpMethod.DELETE, "/profile/{userId}/delete").permitAll()
						.requestMatchers("/api/video/**").permitAll()
						.anyRequest().authenticated()
				)
				.addFilterBefore(jwtAuthenticationFilter,
						UsernamePasswordAuthenticationFilter.class)
				.formLogin(Customizer.withDefaults());

        http.logout(logout -> logout
            .logoutUrl("/auth/logout")
            .addLogoutHandler(jwtLogoutHandler)
            .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler()));

        return http.build();
    }

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// allowedOriginPatterns를 사용하면 와일드카드 패턴 적용이 가능
		configuration.setAllowedOriginPatterns(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList(
				"Authorization",
				"Cache-Control",
				"Content-Type",
				"Sec-WebSocket-Extensions",
				"Sec-WebSocket-Key",
				"Sec-WebSocket-Version",
				"Upgrade",
				"Connection",
				"Host",
				"Origin",
				"*"
		));
		configuration.setExposedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		source.registerCorsConfiguration("/ws/**", configuration);
		return source;
	}


//	@Bean
//	public CorsConfigurationSource corsConfigurationSource() {
//		CorsConfiguration configuration = new CorsConfiguration();
//		configuration.setAllowedOrigins(Arrays.asList(
//				"null",
//				"http://localhost:5173",
//				"ws://localhost:5173",
//				"wss://localhost:5173",
//				"http://boardjjigae.duckdns.org",
//				"https://boardjjigae.duckdns.org",
//				"ws://boardjjigae.duckdns.org",
//				"wss://boardjjigae.duckdns.org"
//		));
//		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//		configuration.setAllowedHeaders(Arrays.asList(
//				"Authorization",
//				"Cache-Control",
//				"Content-Type",
//				"Sec-WebSocket-Extensions",
//				"Sec-WebSocket-Key",
//				"Sec-WebSocket-Version",
//				"Upgrade",
//				"Connection",
//				"Host",
//				"Origin",
//				"*"
//		));
//		configuration.setExposedHeaders(Arrays.asList("*"));
//		configuration.setAllowCredentials(true);
//		configuration.setMaxAge(3600L);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        source.registerCorsConfiguration("/ws/**", configuration);
//        return source;
//    }
}