package de.aktivitaet.activitaet.infrastructure.mapper;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.domain.model.Activity;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ActivityMapper {

    private final UserMapper userMapper;

    public ActivityMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public ActivityDTO toDTO(Activity activity, String currentUsername) {
        if (activity == null) {
            return null;
        }
        return  ActivityDTO.builder()
                .id(activity.getId())
                .name(activity.getName())
                .description(activity.getDescription())
                .rating(activity.getRating())
                .location(activity.getLocation())
                .startTime(activity.getStartTime())
                .endTime(activity.getEndTime())
                .minPrice(activity.getMinPrice())
                .maxPrice(activity.getMaxPrice())
                .minParticipants(activity.getMinParticipants())
                .maxParticipants(activity.getMaxParticipants())
                .imagePath(activity.getImagePath())
                .creator(userMapper.toDTO(activity.getCreator()))
                .isCurrentUserCreator(activity.getCreator().getUsername().equals(currentUsername))
                .participants(activity.getParticipants().stream()
                        .map(userMapper::toDTO)
                        .collect(Collectors.toSet()))
                .isCurrentUserParticipant(activity.getParticipants().stream()
                        .anyMatch(user -> user.getUsername().equals(currentUsername)))
                .build();
    }

    public Activity toEntity(ActivityDTO dto) {
        if (dto == null) {
            return null;
        }

        Activity activity = new Activity();
        activity.setId(dto.getId());
        activity.setName(dto.getName());
        activity.setDescription(dto.getDescription());
        activity.setRating(dto.getRating());
        activity.setLocation(dto.getLocation());
        activity.setStartTime(dto.getStartTime());
        activity.setEndTime(dto.getEndTime());
        activity.setMinPrice(dto.getMinPrice());
        activity.setMaxPrice(dto.getMaxPrice());
        activity.setMinParticipants(dto.getMinParticipants());
        activity.setMaxParticipants(dto.getMaxParticipants());
        activity.setImagePath(dto.getImagePath());
        // Beachten Sie, dass wir den Creator hier nicht setzen, da dies normalerweise
        // vom Service gehandhabt wird

        return activity;
    }

    public void updateEntityFromDTO(ActivityDTO dto, Activity activity) {
        if (dto == null || activity == null) {
            return;
        }

        // Aktualisieren Sie nur die Felder, die im DTO gesetzt sind
        if (dto.getName() != null) activity.setName(dto.getName());
        if (dto.getDescription() != null) activity.setDescription(dto.getDescription());
        if (dto.getRating() != 0) activity.setRating(dto.getRating());
        if (dto.getLocation() != null) activity.setLocation(dto.getLocation());
        if (dto.getStartTime() != null) activity.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) activity.setEndTime(dto.getEndTime());
        if (dto.getMinPrice() != 0) activity.setMinPrice(dto.getMinPrice());
        if (dto.getMaxPrice() != 0) activity.setMaxPrice(dto.getMaxPrice());
        if (dto.getMinParticipants() != 0) activity.setMinParticipants(dto.getMinParticipants());
        if (dto.getMaxParticipants() != 0) activity.setMaxParticipants(dto.getMaxParticipants());
        if (dto.getImagePath() != null) activity.setImagePath(dto.getImagePath());
    }
}