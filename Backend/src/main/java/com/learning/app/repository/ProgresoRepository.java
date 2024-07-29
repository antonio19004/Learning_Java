package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Progreso;

@Repository
public interface ProgresoRepository extends MongoRepository<Progreso, String> {

}
