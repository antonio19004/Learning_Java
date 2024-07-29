package com.learning.app.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "progreso")
public class Progreso {

	@Id
	private String id;
	private Boolean completado;
	private Date fechaInicio;
	private Date fechaFinalizacion;
	
	@DBRef
	private Users user;
	
	@DBRef
	private Cursos curso;

	public Progreso() {
	}

	public Progreso(String id, Boolean completado, Date fechaInicio, Date fechaFinalizacion, Users user, Cursos curso) {
		this.id = id;
		this.completado = completado;
		this.fechaInicio = fechaInicio;
		this.fechaFinalizacion = fechaFinalizacion;
		this.user = user;
		this.curso = curso;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Boolean getCompletado() {
		return completado;
	}

	public void setCompletado(Boolean completado) {
		this.completado = completado;
	}

	public Date getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(Date fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public Date getFechaFinalizacion() {
		return fechaFinalizacion;
	}

	public void setFechaFinalizacion(Date fechaFinalizacion) {
		this.fechaFinalizacion = fechaFinalizacion;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public Cursos getCurso() {
		return curso;
	}

	public void setCurso(Cursos curso) {
		this.curso = curso;
	}
}
