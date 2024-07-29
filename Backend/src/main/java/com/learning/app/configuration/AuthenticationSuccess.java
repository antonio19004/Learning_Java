package com.learning.app.configuration;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthenticationSuccess implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth) throws IOException, ServletException {
		String rol = auth.getAuthorities().stream()
				.map(authority -> authority.getAuthority())
				.findFirst().orElse("ROLE_USER");
		
		if ("ROLE_USER".equals(rol)) {
			response.sendRedirect("/users/");
		} else {
			response.sendRedirect("/admin/");
		}
	}
}
