package com.learning.app.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "respuestasForo")
public class RespuestaForo {

	@Id
	private String id;
	private String contenido;
	private Date fechaPublicacion;
	
	@DBRef
	private Foro foro;
	
	@DBRef
	private Users user;

	public RespuestaForo() {
	}

	public RespuestaForo(String id, String contenido, Date fechaPublicacion, Foro foro, Users user) {
		this.id = id;
		this.contenido = contenido;
		this.fechaPublicacion = fechaPublicacion;
		this.foro = foro;
		this.user = user;
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

	public Foro getForo() {
		return foro;
	}

	public void setForo(Foro foro) {
		this.foro = foro;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}
}
