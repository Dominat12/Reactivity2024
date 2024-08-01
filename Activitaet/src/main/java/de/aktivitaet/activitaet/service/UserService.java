package de.aktivitaet.activitaet.service;

import de.aktivitaet.activitaet.model.User;
import de.aktivitaet.activitaet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Weitere Methoden zur Benutzerverwaltung können hier hinzugefügt werden
}