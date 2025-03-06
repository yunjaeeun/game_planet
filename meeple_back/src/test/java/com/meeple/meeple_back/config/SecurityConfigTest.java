package com.meeple.meeple_back.config;

import com.meeple.meeple_back.user.handler.JwtLogoutHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private JwtLogoutHandler jwtLogoutHandler;

	@Test
	@WithMockUser
	public void testLogout() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.post("/auth/logout"))
				.andExpect(MockMvcResultMatchers.status().is(HttpStatus.OK.value()));
	}
}