package com.learning.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.Dto.AdminDto;
import com.learning.app.Dto.UsersDto;
import com.learning.app.entity.Admin;
import com.learning.app.entity.User;
import com.learning.app.entity.Users;
import com.learning.app.repository.AdminRepository;
import com.learning.app.repository.UsersRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	
	@GetMapping("/details")
	 public AdminDto getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	       String username = authentication.getName();
	       Admin admin = adminRepository.findByUser(username);
	       AdminDto adminDto = new AdminDto();
	       adminDto.setNombre(admin.getNombre());
	       adminDto.setApellido(admin.getApellido());
	       adminDto.setFechaNacimiento(admin.getFechaNacimiento());
	       adminDto.setEmail(admin.getEmail());
	       adminDto.getEdad();
	       
	       return adminDto;
    }
	
/*	
	@GetMapping("/")
	public String index(Model model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String userName = auth.getName();
		Admin admin = adminRepository.findByUser(userName);
		model.addAttribute("admin", admin);
		return "admin/index";
	}
	
	@GetMapping("/list")
	public String getAllAdmin(Model model) {
		model.addAttribute("admin", adminRepository.findAll());
		return "admin/list";
	}
	
	@GetMapping("/{id}")
	public String getAdminById(@PathVariable("id") String id, Model model) {
		Admin admin = adminRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("admin", admin);
		return "admin/details";
	}
	
	@GetMapping("/new")
	public String newAdmin(Model model) {
		model.addAttribute("admin", new Admin());
		return "admin/add";
	}
	
	@PostMapping("/add")
	public String addAdmin(@ModelAttribute("admin") Admin admin, Model model) {
		boolean error = false;
		String errorMessage = null;
		
		if (adminRepository.findByUser(admin.getUser()) != null) {
			errorMessage = "El nombre de usurio " + admin.getUser() + " ya está en uso";
			error = true;
		}
		if (adminRepository.findByEmail(admin.getEmail()) != null) {
			errorMessage = "El correo electrónico " + admin.getEmail() + " ya está vinculado a otra cuenta";
			error = true;
		}
		if (error) {
			model.addAttribute("error", errorMessage);
			model.addAttribute("admin", admin);
			return "admin/add";
		}
		admin.setId(null);
		admin.setPassword(passwordEncoder.encode(admin.getPassword()));
		adminRepository.save(admin);
		return "redirect:/admin/";
	}
	
	@GetMapping("/edit/{id}")
	public String editAdmin(@PathVariable("id") String id, Model model) {
		Admin admin = adminRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("admin", admin);
		return "admin/edit";
	}
	
	@PostMapping("/{id}")
	public String updateAdmin(@PathVariable("id") String id, @ModelAttribute("admin") Admin admin) {
		Admin administrador = adminRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		admin.setPassword(administrador.getPassword());
		admin.setId(id);
		adminRepository.save(admin);
		return "redirect:/admin/";
	}
	
	@GetMapping("/delete/{id}")
	public String deleteAdmin(@PathVariable("id") String id) {
		Admin admin = adminRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		adminRepository.delete(admin);
		return "redirect:/admin/";
	}
	
	@GetMapping("/user-list")
	public String getAllUsers(Model model) {
		model.addAttribute("users", usersRepository.findAll());
		return "users/list";
	}
	
	@GetMapping("/user-details/{id}")
	public String getUserById(@PathVariable("id") String id, Model model) {
		Users users = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("users", users);
		return "admin/userDetails";
	}
	
	@GetMapping("/new-user")
	public String newUser(Model model) {
		model.addAttribute("users", new Users());
		return "admin/addUser";
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
			return "admin/addUser";
		}
		user.setId(null);
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		usersRepository.save(user);
		return "redirect:/admin/";
	}
	
	@GetMapping("/edit-user/{id}")
	public String editUser(@PathVariable("id") String id, Model model) {
		Users users = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		model.addAttribute("users", users);
		return "admin/editUser";
	}
	
	@PostMapping("/update-user/{id}")
	public String updateUser(@PathVariable("id") String id, @ModelAttribute("users") Users users) {
		Users user = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		users.setPassword(user.getPassword());
		users.setCursosCompletados(user.getCursosCompletados());
		users.setId(id);
		usersRepository.save(users);
		return "redirect:/admin/";
	}
	
	@GetMapping("/delete-user/{id}")
	public String deleteUser(@PathVariable("id") String id) {
		Users users = usersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("El usuario no ha sido encontrado"));
		usersRepository.delete(users);
		return "redirect:/admin/";
	}
	
	*/
}