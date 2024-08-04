package com.learning.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.entity.Users;
import com.learning.app.repository.UsersRepository;

@RestController
@RequestMapping("/register")
public class RegistController {

	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/add-user")
	public ResponseEntity<?> addUser(@RequestBody Users user) {
		if (usersRepository.findByUser(user.getUser()) != null) {
			return ResponseEntity.badRequest().body("El nombre de usurio " + user.getUser() + " ya está en uso");
		}
		if (usersRepository.findByEmail(user.getEmail()) != null) {
			return ResponseEntity.badRequest().body("El correo electrónico " + user.getEmail() + " ya está vinculado a otra cuenta");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		Users users = usersRepository.save(user);
		return ResponseEntity.ok(users);
	}
}
