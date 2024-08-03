package de.aktivitaet.activitaet.application.rest;

import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.service.ActivityService;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.exception.UnauthorizedAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    //    TODO was macht das -> @CrossOrigin

    /**
     * Handles the creation of a new activity.
     * Only authenticated users can create activities.
     * Current user will be set as the creator of the activity.
     *
     * @param activity the activity to be created, provided in the request body
     * @param authentication the authentication object containing the user's details
     * @return a ResponseEntity containing the created activity
     */
    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity, Authentication authentication) {
        String creatorUsername = authentication.getName();
        Activity createdActivity = activityService.createActivity(activity, creatorUsername);
        return ResponseEntity.ok(createdActivity);
    }

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<Activity>>  getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());//TODO kein ResponseBody?!
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivity(@PathVariable Long id) {
        Activity activity = activityService.getActivityById(id);
        return ResponseEntity.ok(activity);
    }

    /**
     * Updates an existing activity.
     * Only authenticated users can update activities.
     * The current user will be set as the updater of the activity.
     *
     * @param id the ID of the activity to be updated, provided in the path variable
     * @param activity the activity details to be updated, provided in the request body
     * @param authentication the authentication object containing the user's details
     * @return a ResponseEntity containing the updated activity
     * @throws ResourceNotFoundException if the activity or user is not found
     * @throws UnauthorizedAccessException if the user is not authorized to update the activity
     * @apiNote This endpoint requires authentication. Only the creator of the activity can update it.
     *          Returns HTTP 200 OK on success, 404 Not Found if the activity doesn't exist, //TODO muss dies noch mit dem ReponseEntity Code umgesetzt werden, damit der Fehlercode passt? try catch?
     *          or 403 Forbidden if the user is not authorized.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activity, Authentication authentication) {
        String username = authentication.getName();
        Activity updatedActivity = activityService.updateActivity(id, activity, username);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName(); //TODO Variable sparen, lohnt sich das?
        activityService.deleteActivity(id, username);
        return ResponseEntity.ok().build();
    }

  /**
   * Returns all activities created by the authenticated user.
   *
   * @param authentication the authentication object containing the user's details
   * @return a ResponseEntity containing a list of activities created by the user
   * @throws ResourceNotFoundException if the user is not found
   * @apiNote This endpoint requires authentication. Only the creator of the activity can update it.
   *          Returns HTTP 200 OK on success, 404 Not Found if the activity doesn't exist, //TODO muss dies noch mit dem ReponseEntity Code umgesetzt werden, damit der Fehlercode passt? try catch?
   *          or 403 Forbidden if the user is not authorized.
   *
   */
  @GetMapping("/creator")
  public ResponseEntity<List<Activity>> getActivity(Authentication authentication) {
        String username = authentication.getName();
        List<Activity> activities = activityService.getActivityByCreatorName(username);

        if (activities.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(activities.size()))
                .body(activities);
    }
}