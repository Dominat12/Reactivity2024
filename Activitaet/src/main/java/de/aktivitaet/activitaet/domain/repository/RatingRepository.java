package de.aktivitaet.activitaet.domain.repository;

import de.aktivitaet.activitaet.domain.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndActivityId(Long userId, Long activityId);
}