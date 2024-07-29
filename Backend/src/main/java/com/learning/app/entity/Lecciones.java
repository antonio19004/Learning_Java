package com.learning.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lecciones")
public class Lecciones {

	@Id
	private String id;
	private String titulo;
	private String contenido;
	private String video;
	
	@DBRef
	private Cursos curso;

	public Lecciones() {
	}

	public Lecciones(String id, String titulo, String contenido, String video, Cursos curso) {
		this.id = id;
		this.titulo = titulo;
		this.contenido = contenido;
		this.video = video;
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

	public String getVideo() {
		return video;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public Cursos getCurso() {
		return curso;
	}

	public void setCurso(Cursos curso) {
		this.curso = curso;
	}
}
