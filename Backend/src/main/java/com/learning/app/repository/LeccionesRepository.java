package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Lecciones;

@Repository
public interface LeccionesRepository extends MongoRepository<Lecciones, String> {

}
