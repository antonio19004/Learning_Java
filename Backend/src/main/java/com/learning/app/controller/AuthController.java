package com.learning.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.entity.AuthenticationRequest;
import com.learning.app.entity.AuthenticationResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AuthController {

	@Autowired
    private AuthenticationManager authManager;
	
	@PostMapping("/auth")
	public ResponseEntity<?> authentication(@RequestBody AuthenticationRequest authRequest){
	    String user = authRequest.getUser();
	    String password = authRequest.getPassword();
	    try {
	        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(user, password));
	        SecurityContextHolder.getContext().setAuthentication(auth);
	        System.out.println("User authenticated: " + user);
	        
	        String rol = auth.getAuthorities().stream()
	                .map(authority -> authority.getAuthority())
	                .findAny()
	                .orElseGet(() -> "ROLE_USER");

	        if ("ROLE_ADMIN".equals(rol)) {
	            return ResponseEntity.ok(new AuthenticationResponse("Autenticación Exitosa - Admin ",rol,user));
	        } else {
	            return ResponseEntity.ok(new AuthenticationResponse("Autenticación Exitosa ",rol,user));
	        }
	    } catch (BadCredentialsException e) {
	      
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthenticationResponse("Credenciales inválidas"));
	    } catch (Exception e) {
	       
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AuthenticationResponse("Error desconocido durante la autenticación"));
	    }
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
	    try {
	      
	        request.getSession().invalidate();
	   
	        Cookie cookie = new Cookie("JSESSIONID", null);
	        cookie.setPath("/");
	        cookie.setMaxAge(0);
	        response.addCookie(cookie);
	        return ResponseEntity.ok("Logout exitoso");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error durante el cierre de sesión");
	    }
	}

}
