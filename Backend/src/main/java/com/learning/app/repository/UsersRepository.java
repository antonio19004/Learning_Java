package com.learning.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.learning.app.entity.Users;

@Repository
public interface UsersRepository extends MongoRepository<Users, String>{

	Users findByUser(String user);

	Users findByEmail(String email);

}
