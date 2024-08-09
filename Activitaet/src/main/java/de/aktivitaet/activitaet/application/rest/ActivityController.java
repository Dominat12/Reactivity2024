package de.aktivitaet.activitaet.application.rest;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.Rating;
import de.aktivitaet.activitaet.domain.service.ActivityService;
import de.aktivitaet.activitaet.domain.service.RatingService;
import de.aktivitaet.activitaet.domain.service.UserActivityService;
import de.aktivitaet.activitaet.infrastructure.exception.ResourceNotFoundException;
import de.aktivitaet.activitaet.infrastructure.exception.UnauthorizedAccessException;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@Slf4j
@RestController
@RequestMapping("/activities")
public class ActivityController {

  private final ActivityService activityService;
  private final UserActivityService userActivityService;
  private final RatingService ratingService;

  /**
   * Handles the creation of a new activity. Only authenticated users can create activities. Current
   * user will be set as the creator of the activity.
   *
   * @param activity the activity to be created, provided in the request body
   * @param authentication the authentication object containing the user's details
   * @return a ResponseEntity containing the created activity
   */
  @PostMapping
  public ResponseEntity<ActivityDTO> createActivity(
          @RequestBody ActivityDTO activity, Authentication authentication) {
    log.debug("Creating activity: {}", activity);
    String creatorUsername = authentication.getName();
    ActivityDTO createdActivity = activityService.createActivity(activity, creatorUsername);
    return ResponseEntity.ok(createdActivity);
  }

  @GetMapping
  public ResponseEntity<List<ActivityDTO>> getAllActivities(Authentication authentication) {
    log.debug("Getting all activities");
    String currentUsername = authentication.getName();
    return ResponseEntity.ok(activityService.getAllActivities(currentUsername));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ActivityDTO> getActivity(@PathVariable Long id, Authentication authentication) {
    log.debug("Getting activity with ID: {}", id);
    String currentUsername = authentication.getName();
    ActivityDTO activity = activityService.getActivityById(id, currentUsername);
    return ResponseEntity.ok(activity);
  }


  /**
   * Updates an existing activity. Only authenticated users can update activities. The current user
   * will be set as the updater of the activity.
   *
   * @param id the ID of the activity to be updated, provided in the path variable
   * @param activity the activity details to be updated, provided in the request body
   * @param authentication the authentication object containing the user's details
   * @return a ResponseEntity containing the updated activity
   * @throws ResourceNotFoundException if the activity or user is not found
   * @throws UnauthorizedAccessException if the user is not authorized to update the activity
   * @apiNote This endpoint requires authentication. Only the creator of the activity can update it.
   *     Returns HTTP 200 OK on success, 404 Not Found if the activity doesn't exist, //TODO muss
   *     dies noch mit dem ReponseEntity Code umgesetzt werden, damit der Fehlercode passt? try
   *     catch? or 403 Forbidden if the user is not authorized.
   */
  @PutMapping("/{id}")
  public ResponseEntity<ActivityDTO> updateActivity(
          @PathVariable Long id, @RequestBody ActivityDTO activity, Authentication authentication) {
    log.debug("Updating activity with ID: {}", id);
    String username = authentication.getName();
    ActivityDTO updatedActivity = activityService.updateActivity(id, activity, username);
    return ResponseEntity.ok(updatedActivity);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteActivity(@PathVariable Long id, Authentication authentication) {
    log.debug("Deleting activity with ID: {}", id);
    String username = authentication.getName();
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
   *     Returns HTTP 200 OK on success, 404 Not Found if the activity doesn't exist, //TODO muss
   *     dies noch mit dem ReponseEntity Code umgesetzt werden, damit der Fehlercode passt? try
   *     catch? or 403 Forbidden if the user is not authorized.
   */
  @GetMapping("/creator")
  public ResponseEntity<List<ActivityDTO>> getActivityByCreator(Authentication authentication) {
    log.debug("Getting activities created by the authenticated user");
    String username = authentication.getName();
    List<ActivityDTO> activities = activityService.getActivityByCreatorName(username);

    if (activities.isEmpty()) {
      return ResponseEntity.noContent().build();
    }

    return ResponseEntity.ok()
            .header("X-Total-Count", String.valueOf(activities.size()))
            .body(activities);
  }

  // PARTICIPATING ACTIVITY
  @PostMapping("/{id}/join")
  public ResponseEntity<ActivityDTO> joinActivity(@PathVariable Long id, Authentication authentication) {
    log.debug("User joining activity with ID: {}", id);
    String username = authentication.getName();
    ActivityDTO updatedActivity = activityService.joinActivity(id, username);
    return ResponseEntity.ok(updatedActivity);
  }

  @PostMapping("/{id}/leave")
  public ResponseEntity<ActivityDTO> leaveActivity(@PathVariable Long id, Authentication authentication) {
    log.debug("User leaving activity with ID: {}", id);
    String username = authentication.getName();
    ActivityDTO updatedActivity = activityService.leaveActivity(id, username);
    return ResponseEntity.ok(updatedActivity);
  }

  @GetMapping("/participating")
  public ResponseEntity<Page<ActivityDTO>> getParticipatingActivities(Authentication authentication, Pageable pageable) {
    String username = authentication.getName();
    Page<ActivityDTO> activities = userActivityService.getParticipatingActivities(username, pageable);
    return ResponseEntity.ok(activities);
  }

  @PostMapping("/{activityId}/participants")
  public ResponseEntity<Void> addParticipant(@PathVariable Long activityId, Authentication authentication) {
    String username = authentication.getName();
    userActivityService.addParticipantToActivity(activityId, username);
    return ResponseEntity.ok().build();
  }


  @DeleteMapping("/{activityId}/participants/{participantUsername}")
  public ResponseEntity<ActivityDTO> removeParticipant(
          @PathVariable Long activityId,
          @PathVariable String participantUsername,
          Authentication authentication) {
    log.debug("Removing participant {} from activity with ID: {}", participantUsername, activityId);
    String creatorUsername = authentication.getName();
    ActivityDTO updatedActivity = userActivityService.removeParticipantFromActivity(activityId, participantUsername, creatorUsername);
    return ResponseEntity.ok(updatedActivity);
  }

// RATE ACTIVITY
  @PostMapping("/{activityId}/rate")
  public ResponseEntity<ActivityDTO> rateActivity(
          @PathVariable Long activityId,
          @RequestParam int score,
          @RequestParam(required = false) String comment,
          Authentication authentication) {
    String username = authentication.getName();
    Rating rating = ratingService.rateActivity(activityId, username, score, comment);
    return ResponseEntity.ok(rating); //TODO aktualisierte Activity liefern
  }

  @GetMapping("/{activityId}/rating")
  public ResponseEntity<Rating> getUserRating(
          @PathVariable Long activityId,
          Authentication authentication) {
    String username = authentication.getName();
    Rating rating = ratingService.getRating(activityId, username); //TODO Rating wird nur verwendet, wenn man nur die Ratings haben möchte, ansonsten verwendet man das aus der Activity
    return ResponseEntity.ok(rating);
  }

}
