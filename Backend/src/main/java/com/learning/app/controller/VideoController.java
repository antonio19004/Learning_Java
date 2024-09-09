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

import com.learning.app.entity.Video;
import com.learning.app.repository.VideoRepository;

@RestController
@RequestMapping("/video")
public class VideoController {


    @Autowired
    private VideoRepository videoRepository;
    
    

    @PostMapping("/create")
    public ResponseEntity<Video> createVideo(@RequestBody Video video) {
        try {
            Video savedVideo = videoRepository.save(video);
            return new ResponseEntity<>(savedVideo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    

    @GetMapping("/list")
    public ResponseEntity<List<Video>> getAllVideos() {
        try {
            List<Video> videos = videoRepository.findAll();
            return new ResponseEntity<>(videos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/select/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable String id) {
        Optional<Video> video = videoRepository.findById(id);
        return video.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable String id, @RequestBody Video video) {
        if (!videoRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        video.setId(id);
        try {
            Video updatedVideo = videoRepository.save(video);
            return new ResponseEntity<>(updatedVideo, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable String id) {
        if (!videoRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            videoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
