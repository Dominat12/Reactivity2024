package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.Rating;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.RatingRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    @Transactional
    public Rating rateActivity(Long activityId, String username, int score, String comment) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found: " + activityId));

        Rating rating = ratingRepository.findByUserIdAndActivityId(user.getId(), activityId)
                .orElse(new Rating());

        rating.setUser(user);
        rating.setActivity(activity);
        rating.setScore(score);
        rating.setComment(comment);

        return ratingRepository.save(rating);
    }

    @Transactional(readOnly = true)
    public Rating getRating(Long activityId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return ratingRepository.findByUserIdAndActivityId(user.getId(), activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));
    }
}