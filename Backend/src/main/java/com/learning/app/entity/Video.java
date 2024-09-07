package com.learning.app.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "video")
public class Video {
	
	@Id
	private String id;
	private String title;
	private String url;
	private int duration;
	private int index;
    private String Idcurso;
	
	
	

	public Video(String id, String title, String url, int duration, int index, String Idcurso) {
		super();
		this.id = id;
		this.title = title;
		this.url = url;
		this.duration = duration;
		this.index = index;
		this.Idcurso = Idcurso;
	}
	
	


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getUrl() {
		return url;
	}


	public void setUrl(String url) {
		this.url = url;
	}


	public int getDuration() {
		return duration;
	}


	public void setDuration(int duration) {
		this.duration = duration;
	}


	public int getIndex() {
		return index;
	}


	public void setIndex(int index) {
		this.index = index;
	}




	public String getIdcurso() {
		return Idcurso;
	}




	public void setIdcurso(String idcurso) {
		Idcurso = idcurso;
	}




	
	

}
