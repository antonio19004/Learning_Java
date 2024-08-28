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

import com.learning.app.entity.Topics;
import com.learning.app.repository.TopicsRepository;

@RestController
@RequestMapping("/topic")
public class TopicsController {
	  @Autowired
	    private TopicsRepository topicRepository;

	    @PostMapping
	    public ResponseEntity<Topics> createTopic( @RequestBody Topics topic) {
	        try {
	            Topics savedTopic = topicRepository.save(topic);
	            return new ResponseEntity<>(savedTopic, HttpStatus.CREATED);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	    }

	    @GetMapping
	    public ResponseEntity<List<Topics>> getAllTopics() {
	        try {
	            List<Topics> topics = topicRepository.findAll();
	            return new ResponseEntity<>(topics, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<Topics> getTopicById(@PathVariable String id) {
	        Optional<Topics> topic = topicRepository.findById(id);
	        return topic.map(ResponseEntity::ok)
	                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	    }

	    @PutMapping("/{id}")
	    public ResponseEntity<Topics> updateTopic(@PathVariable String id, @RequestBody Topics topic) {
	        if (!topicRepository.existsById(id)) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        topic.setId(id);
	        try {
	            Topics updatedTopic = topicRepository.save(topic);
	            return new ResponseEntity<>(updatedTopic, HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteTopic(@PathVariable String id) {
	        if (!topicRepository.existsById(id)) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        try {
	            topicRepository.deleteById(id);
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        } catch (Exception e) {
	            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	
	
}
