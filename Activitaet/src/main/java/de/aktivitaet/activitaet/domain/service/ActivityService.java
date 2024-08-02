package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.UnauthorizedAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityService(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Activity createActivity(Activity activity, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        activity.setCreator(creator);
        return activityRepository.save(activity);
    }

    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
    }

    public Activity updateActivity(Long id, Activity updatedActivity, String username) {
        Activity existingActivity = getActivityById(id);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existingActivity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("You are not authorized to update this activity");
        }

        // Update the fields
        existingActivity.setName(updatedActivity.getName());
        existingActivity.setDescription(updatedActivity.getDescription());
        // ... update other fields as necessary

        return activityRepository.save(existingActivity);
    }

    public void deleteActivity(Long id, String username) {
        Activity activity = getActivityById(id);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!activity.isCreatedBy(user)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this activity");
        }

        activityRepository.deleteById(id);
    }
}