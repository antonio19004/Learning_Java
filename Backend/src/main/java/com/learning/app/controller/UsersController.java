package com.learning.app.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.learning.app.Dto.UsersDto;
import com.learning.app.Dto.PasswordDto;
import com.learning.app.entity.Documentacion;
import com.learning.app.entity.Users;
import com.learning.app.repository.UsersRepository;
import com.learning.app.service.DocumentacionService;

@RestController
@RequestMapping("/users")
public class UsersController {

	
	private DocumentacionService documentacionService;
	
	public UsersController(DocumentacionService documentacionService) {
		super();
		this.documentacionService = documentacionService;
	}
	
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/details")
	public UsersDto getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Users user = usersRepository.findByUser(username);
		
		byte[] imagen = user.getImagenPerfil();
		String imagenBase64 = imagen != null ? Base64.getEncoder().encodeToString(imagen) : null;
		
		UsersDto usersDto = new UsersDto();
		usersDto.setNombre(user.getNombre());
		usersDto.setApellido(user.getApellido());
		usersDto.setFechaNacimiento(user.getFechaNacimiento());
		usersDto.getEdad();
		usersDto.setEmail(user.getEmail());
		usersDto.setUser(user.getUser());
		usersDto.setCursosCompletados(user.getCursosCompletados());
		usersDto.setImagenPerfil(imagenBase64);
		
		return usersDto;
	}
	
	@PutMapping("/update-profile")
	public ResponseEntity<String> updateProfile(@RequestParam(value = "imagenPerfil", required = false) MultipartFile file,
			@RequestParam("nombre") String nombre, @RequestParam("apellido") String apellido,
			@RequestParam("fechaNacimiento") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate fechaNacimiento,
			@RequestParam("email") String email, @RequestParam("username") String username) {
		
		try {
			Users users = usersRepository.findByUser(username);
			
			if (users == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no ha sido encontrado");
			}
			
			if (usersRepository.findByEmail(email) != null && !email.equals(users.getEmail())) {
				return ResponseEntity.badRequest().body("El correo electrónico " + email + " ya está vinculado a otra cuenta");
			}
			
			users.setNombre(nombre);
			users.setApellido(apellido);
			users.setFechaNacimiento(fechaNacimiento);
			users.setEmail(email);
			
			if (file != null && !file.isEmpty()) {
				try {
					users.setImagenPerfil(file.getBytes());
				} catch (IOException e) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
				}
			}
		
			usersRepository.save(users);
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
		Users user = usersRepository.findByUser(username);

		if (user != null) {
			if (passwordEncoder.matches(passwordDto.getPassword(), user.getPassword())) {
				user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
				usersRepository.save(user);
				return ResponseEntity.ok("Contraseña Actualizada");
			} else {
				return ResponseEntity.badRequest().body("La contraseña actual es incorrecta");
			}
		} else {
			return ResponseEntity.badRequest().body("El usuario no ha sido encontrado");
		}
	}
	
	
	
	
	//Documentacion users//
	
	  
    @GetMapping("/documentacion/{id}")
    public ResponseEntity<byte[]> verArchivo(@PathVariable String id) {
    	Documentacion archivo = documentacionService.obtenerArchivoPorId(id);
        if (archivo != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + archivo.getTitulo() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, archivo.getTipo())
                    .body(archivo.getContenido());
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @GetMapping("/documentacion/descargar/{id}")
    public ResponseEntity<byte[]> descargarArchivo(@PathVariable String id) {
    	Documentacion archivo = documentacionService.obtenerArchivoPorId(id);
        if (archivo != null) {
        	
            String extension = obtenerExtension(archivo.getTipo());
            String nombreArchivo = archivo.getTitulo();
            
            if (!nombreArchivo.endsWith(extension)) {
                nombreArchivo += extension;
            }
            System.out.println("Tipo MIME: " + archivo.getTipo());
            System.out.println("Nombre del archivo: " + nombreArchivo);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, archivo.getTipo())
                    .body(archivo.getContenido());
            
       

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    

    @GetMapping("/documentacion/listar")
    public List<Documentacion> listarArchivos() {
        System.out.println("Entrando al método listarArchivos...");

        List<Documentacion> archivos = documentacionService.listarArchivos();
        System.out.println("Número de archivos recuperados: " + (archivos != null ? archivos.size() : "null"));

        if (archivos != null) {
            for (Documentacion archivo : archivos) {
                System.out.println("Archivo: " + archivo.getTitulo() + ", ID: " + archivo.getId());
            }
        } else {
            System.out.println("La lista de archivos es nula.");
        }

        return archivos;
    }
	
    
    private String obtenerExtension(String mimeType) {
        switch (mimeType) {
            case "application/pdf":
                return ".pdf";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return ".docx";
            case "application/msword":
                return ".doc";
            default:
                return "";
        }
    }
	
	
/*	
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
	*/
}
