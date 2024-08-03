package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.rest.ActivityController;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.exception.UnauthorizedAccessException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Data
@Slf4j
@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ActivityUtility activityUtility;
    private final UserService userService;


    public Activity createActivity(Activity activity, String creatorUsername) {
        User creator = userService.getUserByName(creatorUsername);
        activity.setCreator(creator);
        return activityRepository.save(activity);
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
    public Activity updateActivity(Long id, Activity updatedActivity, String username) {
        Activity existingActivity = getActivityById(id);
        User user = userService.getUserByName(username);

        if (!existingActivity.isCreatedBy(user)) {
            //TODO: Die UnauthorizedAccessException könnte man darum erweitern, dass der Grund als Variable übergeben wird
            throw new UnauthorizedAccessException("You are not authorized to update this activity. Only the activity creator can make changes.");
        }

        existingActivity = activityUtility.updateActivityWithChanges(updatedActivity, existingActivity);

        return activityRepository.save(existingActivity);
    }

    public void deleteActivity(Long id, String username) {
        Activity activity = getActivityById(id);
        User user = userService.getUserByName(username);

        if (!activity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this activity. Only the activity creator can make changes.");
        }

        activityRepository.deleteById(id);
    }


    //// UTILITY
    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id:'" + id + "'"));
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public List<Activity> getActivityByCreatorName(String username) {
        User creator = userService.getUserByName(username);
        return activityRepository.findByCreator(creator);
    }
}