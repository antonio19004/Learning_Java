package com.learning.app.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.learning.app.entity.Video;

public interface VideoRepository extends MongoRepository<Video,String> {
	List<Video> findAllById(List<String> id);

}
