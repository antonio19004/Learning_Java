package com.learning.app.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learning.app.entity.Course;
import com.learning.app.repository.CoursesRepository;

@RestController
@RequestMapping("/course")
public class CourseController {

	@Autowired
	private CoursesRepository courseRepository;
	
	
	
	 @PostMapping("/create")
	    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
	        try {
	            Course savedCourse = courseRepository.save(course);
	            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	    }
	 
	 @GetMapping("/list")
	    public ResponseEntity<List<Course>> getAllCourses() {
	        try {
	            List<Course> courses = courseRepository.findAll();
	            return new ResponseEntity<>(courses, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @GetMapping("/select/{id}")
	    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
	        Optional<Course> course = courseRepository.findById(id);
	        return course.map(ResponseEntity::ok)
	                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	    }

	    
	    
	    @PutMapping("/update/{id}")
	    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
	        if (!courseRepository.existsById(id)) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        course.setId(id);
	        try {
	            Course updatedCourse = courseRepository.save(course);
	            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	    }

	    @DeleteMapping("/delete/{id}")
	    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
	        if (!courseRepository.existsById(id)) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        try {
	            courseRepository.deleteById(id);
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	 
}
