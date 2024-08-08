package com.learning.app.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.Dto.PasswordDto;
import com.learning.app.entity.Admin;
import com.learning.app.entity.Users;
import com.learning.app.repository.AdminRepository;
import com.learning.app.repository.UsersRepository;

@RestController
@RequestMapping("/password")
public class PasswordController {

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JavaMailSender mail;
	
	@PostMapping("/reset")
	public ResponseEntity<?> requestPassword(@RequestBody String username) {
		Users user = usersRepository.findByUser(username);
		Admin admin = adminRepository.findByUser(username);
		
		if (user == null && admin == null) {
			return ResponseEntity.badRequest().body("El usuario no ha sido encontrado");
		}
		
		String newPassword = generatePassword();
		
		if (user != null) {
			user.setPassword(passwordEncoder.encode(newPassword));
			usersRepository.save(user);
			sendEmail(user.getNombre() ,user.getEmail(), newPassword);
		} else {
			admin.setPassword(passwordEncoder.encode(newPassword));
			adminRepository.save(admin);
			sendEmail(admin.getNombre(), admin.getEmail(), newPassword);
		}
		return ResponseEntity.ok("La contraseña generada ha sido enviada al Email");
	}
	
//	@PostMapping("/reset")
//	public ResponseEntity<?> resetPassword(@RequestBody PasswordDto passwordDto) {
//		Users user = usersRepository.findByUser(passwordDto.getUser());
//		Admin admin = adminRepository.findByUser(passwordDto.getUser());
//		
//		if (user != null) {
//			if (passwordEncoder.matches(passwordDto.getPassword(), user.getPassword())) {
//				user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
//				usersRepository.save(user);
//				return ResponseEntity.ok("Contraseña Actualizada");
//			} else {
//				return ResponseEntity.badRequest().body("La contraseña actual es incorrecta");
//			}
//		} else if (admin != null) {
//			if (passwordEncoder.matches(passwordDto.getPassword(), admin.getPassword())) {
//				admin.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
//				adminRepository.save(admin);
//				return ResponseEntity.ok("Contraseña Actualizada");
//			} else {
//				return ResponseEntity.badRequest().body("La contraseña actual es incorrecta");
//			}
//		} else {
//			return ResponseEntity.badRequest().body("El usuario no ha sido encontrado");
//		}
//	}
	
	private String generatePassword() {
		return UUID.randomUUID().toString().substring(0, 8);
	}
	
	private void sendEmail(String nombre, String email, String newPassword) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("pruebastrabajos25@gmail.com");
		message.setTo(email);
		message.setSubject("Recupera tu contraseña de Learning Java!");
		message.setText("Hola " + nombre + "\n \n" + 
						"Recibimos una solicitud para restablecer la contraseña de tu cuenta. " +
						"Por esta razón hemos generado una nueva contraseña temporal para ti." 
						+ "\n \nTu nueva contraseña es: " + newPassword);
		
		mail.send(message);
	}
}
