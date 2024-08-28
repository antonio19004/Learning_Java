package com.learning.app.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

public class ForumResponse {
	
	private String id;
	private String titulo;
	private String contenido;
	
	@CreatedDate
	private LocalDateTime fechaPublicacion;
	
	private String ultimoModificador;
	private long respuestasCount;
	private boolean isFixed;
	private boolean isHidden;
	
	public ForumResponse() {
	}

	public ForumResponse(String id, String titulo, String contenido, LocalDateTime fechaPublicacion,
			String ultimoModificador, long respuestasCount, boolean isFixed, boolean isHidden) {
		this.id = id;
		this.titulo = titulo;
		this.contenido = contenido;
		this.fechaPublicacion = fechaPublicacion;
		this.ultimoModificador = ultimoModificador;
		this.respuestasCount = respuestasCount;
		this.isFixed = isFixed;
		this.isHidden = isHidden;
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

	public LocalDateTime getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public String getUltimoModificador() {
		return ultimoModificador;
	}

	public void setUltimoModificador(String ultimoModificador) {
		this.ultimoModificador = ultimoModificador;
	}

	public long getRespuestasCount() {
		return respuestasCount;
	}

	public void setRespuestasCount(long respuestasCount) {
		this.respuestasCount = respuestasCount;
	}

	public boolean isFixed() {
		return isFixed;
	}

	public void setFixed(boolean isFixed) {
		this.isFixed = isFixed;
	}

	public boolean isHidden() {
		return isHidden;
	}

	public void setHidden(boolean isHidden) {
		this.isHidden = isHidden;
	}
}
