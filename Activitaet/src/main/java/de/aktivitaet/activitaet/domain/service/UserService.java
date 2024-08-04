package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.dto.UserDTO;
import de.aktivitaet.activitaet.application.dto.UserProfileDTO;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id:'"+ id+"'"));
    }

    public UserProfileDTO getUserProfile(String username) {
        User user = getUserByName(username);
        return userMapper.toProfileDTO(user);
    }

    public UserProfileDTO updateUserProfile(String username, UserProfileDTO updatedProfile) {
        User user = getUserByName(username);
        userMapper.updateUserFromProfileDTO(updatedProfile, user);
        User savedUser = userRepository.save(user);
        return userMapper.toProfileDTO(savedUser);
    }

    public User getUserByName(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username:'"+ username+"'"));
    }

    // Weitere Methoden zur Benutzerverwaltung können hier hinzugefügt werden
}