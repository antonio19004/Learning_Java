package com.learning.app.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.learning.app.Dto.AdminDto;
import com.learning.app.Dto.PasswordDto;
import com.learning.app.entity.Admin;
import com.learning.app.repository.AdminRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/details")
	public AdminDto getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Admin admin = adminRepository.findByUser(username);
		
		byte[] imagen = admin.getImagenPerfil();
		String imagenBase64 = imagen != null ? Base64.getEncoder().encodeToString(imagen) : null;
		
		AdminDto adminDto = new AdminDto();
		adminDto.setNombre(admin.getNombre());
		adminDto.setApellido(admin.getApellido());
		adminDto.setFechaNacimiento(admin.getFechaNacimiento());
		adminDto.getEdad();
		adminDto.setEmail(admin.getEmail());
		adminDto.setUser(admin.getUser());
		adminDto.setImagenPerfil(imagenBase64);
		
		return adminDto;
	}
	
	@PutMapping("/update-profile")
	public ResponseEntity<String> updateProfile(@RequestParam(value = "imagenPerfil", required = false) MultipartFile file,
			@RequestParam("nombre") String nombre, @RequestParam("apellido") String apellido,
			@RequestParam("fechaNacimiento") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate fechaNacimiento,
			@RequestParam("email") String email, @RequestParam("username") String username) {
		
		try {
			Admin admin = adminRepository.findByUser(username);
			
			if (admin == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no ha sido encontrado");
			}
			
			if (adminRepository.findByEmail(email) != null && !email.equals(admin.getEmail())) {
				return ResponseEntity.badRequest().body("El correo electrónico " + email + " ya está vinculado a otra cuenta");
			}
			
			admin.setNombre(nombre);
			admin.setApellido(apellido);
			admin.setFechaNacimiento(fechaNacimiento);
			admin.setEmail(email);
			
			if (file != null && !file.isEmpty()) {
				try {
					admin.setImagenPerfil(file.getBytes());
				} catch (IOException e) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
				}
			}
		
			adminRepository.save(admin);
			return ResponseEntity.ok("La información de la cuenta ha sido actualizada exitosamente");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en la actualización de datos. Inténtelo de nuevo");
		}
	}
	
	@PostMapping("/update-password")
	public ResponseEntity<?> updatePassword(@RequestBody PasswordDto passwordDto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Admin admin = adminRepository.findByUser(username);
		
		if (admin != null) {
			if (passwordEncoder.matches(passwordDto.getPassword(), admin.getPassword())) {
				admin.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
				adminRepository.save(admin);
				return ResponseEntity.ok("Contraseña Actualizada");
			} else {
				return ResponseEntity.badRequest().body("La contraseña actual es incorrecta");
			}
		} else {
			return ResponseEntity.badRequest().body("El usuario no ha sido encontrado");
		}
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