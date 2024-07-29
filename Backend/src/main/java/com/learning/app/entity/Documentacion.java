package com.learning.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "documentos")
public class Documentacion {

	@Id
	private String id;
	private String titulo;
	private String descripcion;
	private String contenido;
	
	public Documentacion() {
	}

	public Documentacion(String id, String titulo, String descripcion, String contenido) {
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.contenido = contenido;
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

	public String getContenido() {
		return contenido;
	}

	public void setContenido(String contenido) {
		this.contenido = contenido;
	}
}
