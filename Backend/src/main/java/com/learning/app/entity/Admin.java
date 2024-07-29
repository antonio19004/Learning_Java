package com.learning.app.entity;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "administrador")
public class Admin {

	@Id
	private String id;
	private String imagenPerfil;
	private String nombre;
	private String apellido;
	private LocalDate fechaNacimiento;
	private String email;
	private String user;
	private String password;
	
	public Admin() {
	}
	
	public Admin(String id, String imagenPerfil, String nombre, String apellido, LocalDate fechaNacimiento,
			String email, String user, String password) {
		this.id = id;
		this.imagenPerfil = imagenPerfil;
		this.nombre = nombre;
		this.apellido = apellido;
		this.fechaNacimiento = fechaNacimiento;
		this.email = email;
		this.user = user;
		this.password = password;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getImagenPerfil() {
		return imagenPerfil;
	}

	public void setImagenPerfil(String imagenPerfil) {
		this.imagenPerfil = imagenPerfil;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}

	public void setFechaNacimiento(LocalDate fechaNacimiento) {
		this.fechaNacimiento = fechaNacimiento;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getEdad() {
        LocalDate nacimiento = fechaNacimiento;
        LocalDate fechaActual = LocalDate.now();
        Period periodo = Period.between(nacimiento, fechaActual);
        return periodo.getYears();
    }
}
