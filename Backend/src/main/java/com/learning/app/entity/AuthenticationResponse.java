package com.learning.app.entity;

public class AuthenticationResponse {

	private String response;
	private String rol;

	public AuthenticationResponse() {
	}

	public AuthenticationResponse(String response) {
		this.response = response;
	}

	public AuthenticationResponse(String response, String rol) {
		this.response = response;
		this.rol = rol;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}
}
