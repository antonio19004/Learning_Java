package com.learning.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "actividades")
public class Actividades {

	@Id
	private String id;
	private String titulo;
	private String contenido;
	
	@DBRef
	private Cursos curso;

	public Actividades() {
	}

	public Actividades(String id, String titulo, String contenido, Cursos curso) {
		this.id = id;
		this.titulo = titulo;
		this.contenido = contenido;
		this.curso = curso;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}

	public Cursos getCurso() {
		return curso;
	}

	public void setCurso(Cursos curso) {
		this.curso = curso;
	}
}
