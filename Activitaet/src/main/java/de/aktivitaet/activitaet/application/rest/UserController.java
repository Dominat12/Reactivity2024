package de.aktivitaet.activitaet.application.rest;

import de.aktivitaet.activitaet.application.dto.UserProfileDTO;
import de.aktivitaet.activitaet.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO userProfile = userService.getUserProfile(username);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateUserProfile(
            @RequestBody UserProfileDTO updatedProfile,
            Authentication authentication) {
        String username = authentication.getName();
        UserProfileDTO updatedUserProfile = userService.updateUserProfile(username, updatedProfile);
        return ResponseEntity.ok(updatedUserProfile);
    }
}