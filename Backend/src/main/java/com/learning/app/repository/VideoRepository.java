package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.learning.app.entity.Video;

public interface VideoRepository extends MongoRepository<Video,String> {

}
