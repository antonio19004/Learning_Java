package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.RespuestaForo;

@Repository
public interface RespuestasRepository extends MongoRepository<RespuestaForo, String> {

}
