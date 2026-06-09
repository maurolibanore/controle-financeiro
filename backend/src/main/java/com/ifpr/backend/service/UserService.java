package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.User;
import com.ifpr.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public User insert(User user) {
        return repository.save(user);
    }

    public User update(User user) {
        
        User foundedUser = findById(user.getId());
        foundedUser.setName(user.getName());
        foundedUser.setEmail(user.getEmail());

        return repository.save(foundedUser);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<User> findAll() {
        return repository.findAll();
    }

    public User findById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return user;
    }
}