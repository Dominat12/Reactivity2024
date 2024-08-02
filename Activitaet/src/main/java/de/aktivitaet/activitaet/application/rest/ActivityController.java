package de.aktivitaet.activitaet.application.rest;

import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity, Authentication authentication) {
        String creatorUsername = authentication.getName();
        Activity createdActivity = activityService.createActivity(activity, creatorUsername);
        return ResponseEntity.ok(createdActivity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivity(@PathVariable Long id) {
        Activity activity = activityService.getActivityById(id);
        return ResponseEntity.ok(activity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activity, Authentication authentication) {
        String username = authentication.getName();
        Activity updatedActivity = activityService.updateActivity(id, activity, username);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        activityService.deleteActivity(id, username);
        return ResponseEntity.ok().build();
    }
}