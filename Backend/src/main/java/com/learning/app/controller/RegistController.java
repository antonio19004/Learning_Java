package com.learning.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.learning.app.entity.Users;
import com.learning.app.repository.UsersRepository;

@Controller
@RequestMapping("/register")
public class RegistController {

	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/new-user")
	public String newUser(Model model) {
		model.addAttribute("users", new Users());
		return "users/add";
	}
	
	@PostMapping("/add-user")
	public String addUser(@ModelAttribute("users") Users user, Model model) {
		boolean error = false;
		String errorMessage = null;
		
		if (usersRepository.findByUser(user.getUser()) != null) {
			errorMessage = "El nombre de usurio " + user.getUser() + " ya está en uso";
			error = true;
		}
		if (usersRepository.findByEmail(user.getEmail()) != null) {
			errorMessage = "El correo electrónico " + user.getEmail() + " ya está vinculado a otra cuenta";
			error = true;
		}
		if (error) {
			model.addAttribute("error", errorMessage);
			model.addAttribute("users", user);
			return "users/add";
		}
		user.setId(null);
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		usersRepository.save(user);
		return "redirect:/login";
	}
}
