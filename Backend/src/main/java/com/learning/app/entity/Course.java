package com.learning.app.entity;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.learning.app.Enum.Level;

@Document(collection = "course")
public class Course { 

	@Id
	private String id;
	private String title;
	@LastModifiedDate
	private LocalDate lastUpdate;
	@CreatedDate
	private LocalDate createdDate;
	private int duration;
	private Level level;
	private List<Video> video;
	private List<String> objetives;
	private List<String> content;
	private double progress;
	@DBRef
	private List<Topics> topics;
	
	
	
	
	public Course() {
		super();
	}







	public Course(String id, String title, LocalDate lastUpdate, LocalDate createdDate, int duration, Level level,
			List<Video> video, List<String> objetives, List<String> content, double progress, List<Topics> topics) {
		super();
		this.id = id;
		this.title = title;
		this.lastUpdate = lastUpdate;
		this.createdDate = createdDate;
		this.duration = duration;
		this.level = level;
		this.video = video;
		this.objetives = objetives;
		this.content = content;
		this.progress = progress;
		this.topics = topics;
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


	public LocalDate getLastUpdate() {
		return lastUpdate;
	}


	public void setLastUpdate(LocalDate lastUpdate) {
		this.lastUpdate = lastUpdate;
	}


	public int getDuration() {
		return duration;
	}


	public void setDuration(int duration) {
		this.duration = duration;
	}


	public Level getLevel() {
		return level;
	}
	


	public void setLevel(Level level) {
		this.level = level;
	}



	public List<Video> getVideo() {
		return video;
	}


	public void setVideo(List<Video> video) {
		this.video = video;
	}


	public List<String> getObjetives() {
		return objetives;
	}


	public void setObjetives(List<String> objetives) {
		this.objetives = objetives;
	}


	public double getProgress() {
		return progress;
	}


	public void setProgress(double progress) {
		this.progress = progress;
	}


	public List<Topics> getTopics() {
		return topics;
	}


	public void setTopics(List<Topics> topics) {
		this.topics = topics;
	}


	public LocalDate getCreated() {
		return createdDate;
	}



	public List<String> getContent() {
		return content;
	}



	public void setContent(List<String> content) {
		this.content = content;
	}

	
	
	
	
	
	
}
