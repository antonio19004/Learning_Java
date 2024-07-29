package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Actividades;

@Repository
public interface ActividadesRepository extends MongoRepository<Actividades, String> {

}
