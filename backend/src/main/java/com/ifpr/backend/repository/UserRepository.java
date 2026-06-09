package com.ifpr.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ifpr.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    
}