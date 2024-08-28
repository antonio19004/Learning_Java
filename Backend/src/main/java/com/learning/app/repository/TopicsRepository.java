package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.learning.app.entity.Topics;

public interface TopicsRepository extends MongoRepository<Topics,String>{

}
