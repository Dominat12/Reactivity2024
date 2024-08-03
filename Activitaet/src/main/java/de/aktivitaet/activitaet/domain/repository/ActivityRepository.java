package de.aktivitaet.activitaet.domain.repository;


import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByCreator(User creator);
}
