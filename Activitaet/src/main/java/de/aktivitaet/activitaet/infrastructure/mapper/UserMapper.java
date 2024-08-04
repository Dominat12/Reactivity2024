package de.aktivitaet.activitaet.infrastructure.mapper;

import de.aktivitaet.activitaet.application.dto.UserDTO;
import de.aktivitaet.activitaet.domain.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        // Fügen Sie hier weitere Felder hinzu, die Sie im DTO haben möchten
        return dto;
    }

    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        // Fügen Sie hier weitere Felder hinzu, die Sie in der Entity setzen möchten
        return user;
    }
}