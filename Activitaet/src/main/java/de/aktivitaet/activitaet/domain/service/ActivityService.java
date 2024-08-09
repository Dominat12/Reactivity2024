package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.application.rest.ActivityController;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.exception.UnauthorizedAccessException;
import de.aktivitaet.activitaet.infrastructure.mapper.ActivityMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Slf4j
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;
    private final ActivityUtility activityUtility;

    private final UserRepository userRepository;
    private final UserService userService;

    public ActivityDTO createActivity(ActivityDTO activityDTO, String creatorUsername) {
        User creator = userService.getUserByName(creatorUsername);
        Activity activity = activityMapper.toEntity(activityDTO);
        activity.setCreator(creator);
        Activity savedActivity = activityRepository.save(activity);
        return activityMapper.toDTO(savedActivity, creatorUsername);
    }

    /**
     *
     * @param id
     * @param updatedActivity
     * @param username
     * @return
     * @throws UnauthorizedAccessException if the user is not the creator of the activity
     * @see ActivityController#updateActivity(Long id, Activity activity, Authentication authentication) for the API endpoint
     */
    public ActivityDTO updateActivity(Long id, ActivityDTO updatedActivityDTO, String username) {
        Activity existingActivity = getActivityById(id);
        User user = userService.getUserByName(username);

        if (!existingActivity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("You are not authorized to update this activity.");
        }

        activityMapper.updateEntityFromDTO(updatedActivityDTO, existingActivity);
        Activity savedActivity = activityRepository.save(existingActivity);
        return activityMapper.toDTO(savedActivity, username);
    }

    public void deleteActivity(Long id, String username) {
        Activity activity = getActivityById(id);
        User user = userService.getUserByName(username);

        if (!activity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this activity.");
        }

        activityRepository.deleteById(id);
    }

    public ActivityDTO joinActivity(Long activityId, String username) {
        Activity activity = getActivityById(activityId);
        User user = userService.getUserByName(username);

        if (activity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("The creator cannot join their own activity.");
        }

        if (activity.addParticipant(user)) {
            activity = activityRepository.save(activity);
            return activityMapper.toDTO(activity, username);
        } else {
            throw new IllegalStateException("User is already a participant.");
        }
    }

    public ActivityDTO leaveActivity(Long activityId, String username) {
        Activity activity = getActivityById(activityId);
        User user = userService.getUserByName(username);

        if (activity.removeParticipant(user)) {
            activity = activityRepository.save(activity);
            return activityMapper.toDTO(activity, username);
        } else {
            throw new IllegalStateException("User is not a participant of this activity.");
        }
    }

    public ActivityDTO removeParticipant(Long activityId, String creatorUsername, String participantUsername) {
        Activity activity = getActivityById(activityId);
        User creator = userService.getUserByName(creatorUsername);
        User participant = userService.getUserByName(participantUsername);

        if (!activity.isCreatedBy(creator)) {
            throw new UnauthorizedAccessException("Only the creator can remove participants.");
        }

        if (activity.removeParticipant(participant)) {
            activity = activityRepository.save(activity);
            return activityMapper.toDTO(activity, creatorUsername);
        } else {
            throw new IllegalStateException("User is not a participant of this activity.");
        }
    }



    //// UTILITY
    public ActivityDTO getActivityById(Long id, String currentUsername) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id:'" + id + "'"));
        return activityMapper.toDTO(activity, currentUsername);
    }

    public List<ActivityDTO> getAllActivities(String currentUsername) {
        List<Activity> activities = activityRepository.findAll();
        return activities.stream()
                .map(activity ->  activityMapper.toDTO(activity, currentUsername))
                .collect(Collectors.toList());
    }

    public List<ActivityDTO> getActivityByCreatorName(String username) {
        User creator = userService.getUserByName(username);
        List<Activity> activities = activityRepository.findByCreator(creator);
        return activities.stream()
                .map(activity -> activityMapper.toDTO(activity, username))
                .collect(Collectors.toList());
    }

    private Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id:'" + id + "'"));
    }
}