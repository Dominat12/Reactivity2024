package de.aktivitaet.activitaet.domain.repository;


import de.aktivitaet.activitaet.domain.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
