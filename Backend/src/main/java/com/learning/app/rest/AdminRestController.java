package com.learning.app.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.entity.Admin;
import com.learning.app.entity.Users;
import com.learning.app.repository.AdminRepository;
import com.learning.app.repository.UsersRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping
	public List<Admin> getAllAdmin() {
		return adminRepository.findAll();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
		Optional<Admin> admin = adminRepository.findById(id);
		
		if (admin.isPresent()) {
			return ResponseEntity.ok(admin.get());
		}
		
		return ResponseEntity.notFound().build();
	}
	
	@PostMapping
	public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
		if (adminRepository.findByUser(admin.getUser()) != null) {
			return ResponseEntity.badRequest().body("El nombre de usurio " + admin.getUser() + " ya está en uso");
		}
		if (adminRepository.findByEmail(admin.getEmail()) != null) {
			return ResponseEntity.badRequest().body("El correo electrónico " + admin.getEmail() + " ya está vinculado a otra cuenta");
		}
		admin.setPassword(passwordEncoder.encode(admin.getPassword()));
		Admin administrador = adminRepository.save(admin);
		return ResponseEntity.ok(administrador);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Admin> updateAdmin(@PathVariable String id, @RequestBody Admin update) {
		Optional<Admin> admin = adminRepository.findById(id);
		
		if (admin.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Admin administrador = admin.get();
		administrador.setId(id);
		administrador.setPassword(update.getPassword());
		
		Admin updateAdmin = adminRepository.save(administrador);
		return ResponseEntity.ok(updateAdmin);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAdmin(@PathVariable String id) {
		adminRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/user-list")
	public List<Users> getAllUsers() {
		return usersRepository.findAll();
	}
	
	@GetMapping("/user-details/{id}")
	public ResponseEntity<Users> getUserById(@PathVariable String id) {
		Optional<Users> user = usersRepository.findById(id);
		
		if (user.isPresent()) {
			return ResponseEntity.ok(user.get());
		}
		
		return ResponseEntity.notFound().build();
	}
	
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
	
	@PutMapping("/update-user/{id}")
	public ResponseEntity<Users> updateUser(@PathVariable String id, @RequestBody Users update) {
		Optional<Users> user = usersRepository.findById(id);
		
		if (user.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Users users = user.get();
		users.setId(id);
		users.setPassword(update.getPassword());
		users.setCursosCompletados(update.getCursosCompletados());
		
		Users updateUser = usersRepository.save(users);
		return ResponseEntity.ok(updateUser);
	}
	
	@DeleteMapping("/delete-user/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable String id) {
		usersRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
