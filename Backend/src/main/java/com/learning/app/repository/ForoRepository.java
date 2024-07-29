package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Foro;

@Repository
public interface ForoRepository extends MongoRepository<Foro, String> {

}
