package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Course;

@Repository
public interface CoursesRepository extends MongoRepository<Course, String> {

}
