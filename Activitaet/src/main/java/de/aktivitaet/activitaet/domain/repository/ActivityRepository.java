package de.aktivitaet.activitaet.domain.repository;


import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByCreator(User creator);

    @Query("SELECT DISTINCT a FROM Activity a JOIN a.participants p WHERE p.id = :userId")
    Page<Activity> findActivitiesByParticipantId(@Param("userId") Long userId, Pageable pageable);
}
