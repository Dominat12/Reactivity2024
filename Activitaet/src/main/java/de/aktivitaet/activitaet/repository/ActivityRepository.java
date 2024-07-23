package de.aktivitaet.activitaet.repository;


import de.aktivitaet.activitaet.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
