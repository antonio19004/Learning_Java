package com.learning.app.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comentarios")
public class Comentarios {

	@Id
	private String id;
	private String contenido;
	private Date fechaPublicacion;
	
	@DBRef
	private Users user;
	
	@DBRef
	private Course curso;

	public Comentarios() {
	}

	public Comentarios(String id, String contenido, Date fechaPublicacion, Users user, Course curso) {
		this.id = id;
		this.contenido = contenido;
		this.fechaPublicacion = fechaPublicacion;
		this.user = user;
		this.curso = curso;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public Date getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Date fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public Course getCurso() {
		return curso;
	}

	public void setCurso(Course curso) {
		this.curso = curso;
	}
}
