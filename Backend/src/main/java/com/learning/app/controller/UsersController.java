package com.learning.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.learning.app.entity.Users;
import com.learning.app.repository.UsersRepository;

@Controller
@RequestMapping("/users")
public class UsersController {

	@Autowired
	private UsersRepository usersRepository;
	
	@GetMapping("/")
	public String index(Model model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userName = auth.getName();
		Users user = usersRepository.findByUser(userName);
		model.addAttribute("user", user);
		return "users/index";
	}
	
	@GetMapping("/{id}")
	public String getUserById(@PathVariable("id") String id, Model model) {
		Users users = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("users", users);
		return "users/details";
	}
	
	@GetMapping("/edit/{id}")
	public String editUser(@PathVariable("id") String id, Model model) {
		Users users = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("users", users);
		return "users/edit";
	}
	
	@PostMapping("/{id}")
	public String updateUser(@PathVariable("id") String id, @ModelAttribute("users") Users users) {
		Users user = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		users.setPassword(user.getPassword());
		users.setCursosCompletados(user.getCursosCompletados());
		users.setId(id);
		usersRepository.save(users);
		return "redirect:/users/";
	}
}
