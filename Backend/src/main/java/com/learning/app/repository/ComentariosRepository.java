package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Comentarios;

@Repository
public interface ComentariosRepository extends MongoRepository<Comentarios, String> {

}
