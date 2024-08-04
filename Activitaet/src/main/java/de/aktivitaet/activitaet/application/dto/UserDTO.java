package de.aktivitaet.activitaet.application.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    // Weitere relevante Felder, aber ohne sensible Informationen wie Passwort
}