package de.aktivitaet.activitaet.controller;

import de.aktivitaet.activitaet.model.Activity;
import de.aktivitaet.activitaet.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "http://localhost:5173")  // Erlaubt CORS für Ihre React-Anwendung
public class ActivityController {


    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @PostMapping
    public Activity createActivity(@RequestBody Activity activity) {
        return activityRepository.save(activity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activityDetails) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));

        activity.setName(activityDetails.getName());
        activity.setDescription(activityDetails.getDescription());
        activity.setRating(activityDetails.getRating());
        activity.setLocation(activityDetails.getLocation());
        activity.setStartTime(activityDetails.getStartTime());
        activity.setEndTime(activityDetails.getEndTime());
        activity.setMinPrice(activityDetails.getMinPrice());
        activity.setMaxPrice(activityDetails.getMaxPrice());
        activity.setMinParticipants(activityDetails.getMinParticipants());
        activity.setMaxParticipants(activityDetails.getMaxParticipants());

        Activity updatedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));

        activityRepository.delete(activity);
        return ResponseEntity.ok().build();
    }
}
