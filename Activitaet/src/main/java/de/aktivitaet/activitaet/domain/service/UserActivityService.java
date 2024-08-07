package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.mapper.ActivityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserActivityService {
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    @Transactional(readOnly = true)
    public Page<ActivityDTO> getParticipatingActivities(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Page<Activity> activities = activityRepository.findActivitiesByParticipantId(user.getId(), pageable);
        return activities.map(activity -> activityMapper.toDTO(activity, username));
    }

    @Transactional
    public void addParticipantToActivity(Long activityId, String username) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found: " + activityId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (!activity.getParticipants().contains(user)) {
            activity.getParticipants().add(user);
            activityRepository.save(activity);
        }
    }

    @Transactional
    public void removeParticipantFromActivity(Long activityId, String username) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found: " + activityId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (activity.getParticipants().remove(user)) {
            activityRepository.save(activity);
        }
    }
}