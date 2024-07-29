package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Cursos;

@Repository
public interface CursosRepository extends MongoRepository<Cursos, String> {

}
