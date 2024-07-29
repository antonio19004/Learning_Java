package com.learning.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cursos")
public class Cursos {

	@Id
	private String id;
	private String titulo;
	private String descripcion;
	private Boolean visible;
	
	public Cursos() {
	}

	public Cursos(String id, String titulo, String descripcion, Boolean visible) {
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.visible = visible;
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

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public Boolean getVisible() {
		return visible;
	}

	public void setVisible(Boolean visible) {
		this.visible = visible;
	}
}
