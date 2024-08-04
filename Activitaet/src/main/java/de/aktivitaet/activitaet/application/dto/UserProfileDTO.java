package de.aktivitaet.activitaet.application.dto;

import de.aktivitaet.activitaet.domain.model.User;
import lombok.*;

import java.time.LocalDate;

@Builder
@Data
public class UserProfileDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String alias;
    private LocalDate birthDate;
    private String phoneNumber;
    private String email;
    private User.Gender gender;
    /**
     * Role will not be updated by the user via this DTO
     * -> aus Request DTO genauso wie username rausnehmen
     */
    private  User.Role role;
}