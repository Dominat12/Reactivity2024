package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.domain.model.Activity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.function.Consumer;
import java.util.function.Supplier;

@Slf4j
@Service
public class ActivityUtility {

    /**
     * Updates the fields of an activity object with the values from another activity object.
     * Update only the fields that are changeable by the user.
     * The current participants,rating , creator, and ID of the activity will not be changed.
     * @param newActivity
     * @param oldActivity
     * @return the updated activity object
     */
    public static Activity updateActivityWithChanges(Activity newActivity, Activity oldActivity) {
        updateField("name", newActivity::getName, oldActivity::setName, oldActivity);
        updateField("description", newActivity::getDescription, oldActivity::setDescription, oldActivity);
        updateField("location", newActivity::getLocation, oldActivity::setLocation, oldActivity);
        updateField("startTime", newActivity::getStartTime, oldActivity::setStartTime, oldActivity);
        updateField("endTime", newActivity::getEndTime, oldActivity::setEndTime, oldActivity);
        updateField("minPrice", newActivity::getMinPrice, oldActivity::setMinPrice, oldActivity);
        updateField("maxPrice", newActivity::getMaxPrice, oldActivity::setMaxPrice, oldActivity);
        updateField("minParticipants", newActivity::getMinParticipants, oldActivity::setMinParticipants, oldActivity);
        updateField("maxParticipants", newActivity::getMaxParticipants, oldActivity::setMaxParticipants, oldActivity);

        return oldActivity;
    }

    private static <T> void updateField(String fieldName, Supplier<T> getter, Consumer<T> setter, Activity oldActivity) {
        T newValue = getter.get();
        if (newValue != null && !newValue.equals(getFieldValue(oldActivity, fieldName))) {
            T oldValue = getFieldValue(oldActivity, fieldName);
            setter.accept(newValue);
            log.debug("{} updated from '{}' to '{}'", fieldName, oldValue, newValue);
        } else {
            log.debug("{} field could not be updated", fieldName);
        }
    }

    @SuppressWarnings("unchecked")
    private static <T> T getFieldValue(Activity activity, String fieldName) {
        try {
            Field field = Arrays.stream(Activity.class.getDeclaredFields())
                    .filter(f -> f.getName().equals(fieldName))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchFieldException("Field " + fieldName + " not found"));
            field.setAccessible(true);
            return (T) field.get(activity);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error("Error accessing field: " + fieldName, e);
            return null;
        }
    }
}
