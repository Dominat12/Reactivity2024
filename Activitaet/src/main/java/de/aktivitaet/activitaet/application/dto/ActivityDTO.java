package de.aktivitaet.activitaet.application.dto;

import de.aktivitaet.activitaet.domain.model.User;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
@Data
public class ActivityDTO {
    private Long id;
    private String name;
    private String description;
    private int rating;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double minPrice;
    private double maxPrice;
    private int minParticipants;
    private int maxParticipants;
    private String imagePath;
    private UserDTO creator;
    private Set<UserDTO> participants;

    private boolean isCurrentUserCreator;
    private boolean isCurrentUserParticipant;


    public boolean isCreatedBy(User user) {
        return this.creator != null && this.creator.equals(user);
    }

    public boolean isCreatedBy(String username) {
        return this.creator != null && this.creator.getUsername().equals(username);
    }
}