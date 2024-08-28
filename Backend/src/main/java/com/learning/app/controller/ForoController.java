package com.learning.app.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.Dto.ForoDto;
import com.learning.app.entity.Admin;
import com.learning.app.entity.Foro;
import com.learning.app.entity.ForumResponse;
import com.learning.app.entity.RespuestaForo;
import com.learning.app.entity.RespuestasForo;
import com.learning.app.entity.Users;
import com.learning.app.repository.AdminRepository;
import com.learning.app.repository.ForoRepository;
import com.learning.app.repository.RespuestaRepository;
import com.learning.app.repository.RespuestasRepository;
import com.learning.app.repository.UsersRepository;

@RestController
@RequestMapping("/forum")
public class ForoController {

	@Autowired
	private ForoRepository foroRepository;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UsersRepository usersRepository;
	
	@Autowired
	private RespuestasRepository respuestasRepository;
	
	@Autowired
	private RespuestaRepository responseRepository;
	
	@GetMapping
	public ResponseEntity<List<ForumResponse>> getAllForum(@AuthenticationPrincipal UserDetails userDetails) {
		List<Foro> foros;
		
		Admin admin = adminRepository.findByUser(userDetails.getUsername());
		
		if (admin != null) {
			foros = foroRepository.findAll();
		} else {
			foros = foroRepository.findVisibleSorted();
		}
		
		List<ForumResponse> forumResponses = foros.stream().map(foro -> {
			long respuestasCount = respuestasRepository.countByForo(foro);
			String ultimoModificador = "Usuario desconocido";
			LocalDateTime ultimaModificacion = foro.getFechaPublicacion();
			
			RespuestasForo ultimaRespuesta = respuestasRepository.findFirstByForoOrderByFechaPublicacionDesc(foro);
			
			if (ultimaRespuesta != null) {
				ultimaModificacion = ultimaRespuesta.getFechaPublicacion();
				if (ultimaRespuesta.getUser() != null) {
					ultimoModificador = ultimaRespuesta.getUser().getUser();
				} else if (ultimaRespuesta.getAdmin() != null) {
					ultimoModificador = ultimaRespuesta.getAdmin().getUser();
				}
			} else {
				if (foro.getUser() != null) {
					ultimoModificador = foro.getUser().getUser();
				} else if (foro.getAdmin() != null) {
					ultimoModificador = foro.getAdmin().getUser();
				}
			}
			
			return new ForumResponse(foro.getId(), foro.getTitulo(), foro.getContenido(), ultimaModificacion, ultimoModificador, respuestasCount, foro.isFixed(), foro.isHidden());
		}).collect(Collectors.toList());
		
		return ResponseEntity.ok(forumResponses);
	}
	
	@PostMapping
	public ResponseEntity<Foro> addForum(@RequestBody Foro foro, @AuthenticationPrincipal UserDetails userDetails) {
		Users user = usersRepository.findByUser(userDetails.getUsername());
		Admin admin = adminRepository.findByUser(userDetails.getUsername());
		
		if (user != null) {
			foro.setUser(user);
		} else if (admin != null) {
			foro.setAdmin(admin);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
		
		foro.setFechaPublicacion(LocalDateTime.now());
		Foro newForum = foroRepository.save(foro);
		return new ResponseEntity<>(newForum, HttpStatus.CREATED);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Foro> getForumById(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			return ResponseEntity.ok(foro.get());
		}
		return ResponseEntity.notFound().build();
	}
	
	@GetMapping("/{id}/respuestas")
	public ResponseEntity<List<RespuestasForo>> getAllResponses(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			List<RespuestasForo> respuestas = respuestasRepository.findByForo(foro.get());
			return ResponseEntity.ok(respuestas);
		}
		return ResponseEntity.notFound().build();
	}
	
	@PostMapping("/{id}/respuesta")
	public ResponseEntity<RespuestasForo> addResponses(@PathVariable String id, @RequestBody RespuestasForo respuesta, @AuthenticationPrincipal UserDetails userDetails) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			String username = userDetails.getUsername();
			Users user = usersRepository.findByUser(username);
			Admin admin = adminRepository.findByUser(username);
			
			if (user != null) {
				respuesta.setUser(user);
			} else if (admin != null) {
				respuesta.setAdmin(admin);
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}
			
			respuesta.setFechaPublicacion(LocalDateTime.now());
			respuesta.setForo(foro.get());
			RespuestasForo saved = respuestasRepository.save(respuesta);
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@GetMapping("/{replying}/responses")
	public ResponseEntity<List<RespuestaForo>> getAllResponsesByResponse(@PathVariable String replying) {
		Optional<RespuestasForo> respuesta = respuestasRepository.findById(replying);
		
		if (respuesta.isPresent()) {
			List<RespuestaForo> respuestas = responseRepository.findByRespuesta(respuesta.get());
			return ResponseEntity.ok(respuestas);
		}
		return ResponseEntity.notFound().build();
	}
	
	@PostMapping("/{replying}/response")
	public ResponseEntity<RespuestaForo> addResponse(@PathVariable String replying, @RequestBody RespuestaForo response, @AuthenticationPrincipal UserDetails userDetails) {
		RespuestasForo respuesta = respuestasRepository.findById(replying).orElse(null);
		
		if (respuesta != null) {
			String username = userDetails.getUsername();
			Users user = usersRepository.findByUser(username);
			Admin admin = adminRepository.findByUser(username);
			
			if (user != null) {
				response.setUser(user);
			} else if (admin != null) {
				response.setAdmin(admin);
			}
			
			response.setFechaPublicacion(LocalDateTime.now());
			response.setRespuesta(respuesta);
			return ResponseEntity.ok(responseRepository.save(response));
		}
		return ResponseEntity.notFound().build();
	}
	
	@PutMapping("/{id}/pin")
	public ResponseEntity<String> pinForum(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			Foro forum = foro.get();
			forum.setFixed(true);
			foroRepository.save(forum);
			
			String message = "Tema anclado exitosamente";
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado.");
        }
	}
	
	@PutMapping("/{id}/unpin")
	public ResponseEntity<String> unpinForum(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			Foro forum = foro.get();
			forum.setFixed(false);
			foroRepository.save(forum);
			
			String message = "Tema desanclado exitosamente";
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado.");
        }
	}
	
	@PutMapping("/{id}/hide")
	public ResponseEntity<String> hideForum(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			Foro forum = foro.get();
			forum.setHidden(true);
			foroRepository.save(forum);
			
			String message = "Tema ocultado exitosamente";
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado.");
        }
	}
	
	@PutMapping("/{id}/show")
	public ResponseEntity<String> showForum(@PathVariable String id) {
		Optional<Foro> foro = foroRepository.findById(id);
		
		if (foro.isPresent()) {
			Foro forum = foro.get();
			forum.setHidden(false);
			foroRepository.save(forum);
			
			String message = "Tema mostrado";
			return ResponseEntity.ok(message);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado.");
        }
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateForum(@PathVariable String id, @RequestBody ForoDto foroDto) {
		Optional<Foro> foro = foroRepository.findById(id);
		if (foro.isPresent()) {
			Foro forum = foro.get();
			forum.setTitulo(foroDto.getTitulo());
			forum.setContenido(foroDto.getContenido());
			forum.setFixed(foroDto.isFixed());
			forum.setHidden(foroDto.isHidden());
			foroRepository.save(forum);
			
			ForumResponse response = new ForumResponse();
			response.setId(forum.getId());
			response.setTitulo(forum.getTitulo());
			response.setContenido(forum.getContenido());
			response.setFechaPublicacion(forum.getFechaPublicacion());
			response.setUltimoModificador(forum.getUser().getUser());
			response.setRespuestasCount(forum.getRespuestasCount());
			response.setFixed(forum.isFixed());
			response.setHidden(forum.isHidden());
			
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado.");
		}
	}
}
