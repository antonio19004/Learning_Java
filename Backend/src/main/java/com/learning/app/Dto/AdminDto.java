package com.learning.app.Dto;

import java.time.LocalDate;
import java.time.Period;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AdminDto {

	private String nombre;
	private String apellido;
	private String email;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yy")
	private LocalDate fechaNacimiento;
	
	private int edad;
	
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public LocalDate getFechaNacimiento() {
		return fechaNacimiento;
	}
	
	public void setFechaNacimiento(LocalDate dateOfBirth) {
		this.fechaNacimiento = dateOfBirth;
		this.edad = calculateAge(dateOfBirth);
	}
	
	public int getEdad() {
		return edad;
	}
	
	private int calculateAge(LocalDate birthDate) {
		if (birthDate != null) {
			return Period.between(birthDate, LocalDate.now()).getYears();
		} else {
			return 0;
		}
	}
}
