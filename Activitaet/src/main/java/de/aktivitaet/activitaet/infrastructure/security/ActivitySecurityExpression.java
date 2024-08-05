package de.aktivitaet.activitaet.infrastructure.security;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.domain.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;



@Component
public class ActivitySecurityExpression {

    @Autowired
    private ActivityService activityService;

    public boolean isActivityCreator(Authentication authentication, Long activityId) {
        String username = authentication.getName();
        ActivityDTO activity = activityService.getActivityById(activityId, username);
        return activity.isCurrentUserCreator();
    }
}