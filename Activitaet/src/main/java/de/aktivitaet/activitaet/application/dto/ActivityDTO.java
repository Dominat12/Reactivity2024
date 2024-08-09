package de.aktivitaet.activitaet.application.dto;

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
    private double rating;
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

}