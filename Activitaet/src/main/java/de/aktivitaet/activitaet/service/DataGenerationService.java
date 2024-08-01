package de.aktivitaet.activitaet.service;

import de.aktivitaet.activitaet.model.Activity;
import de.aktivitaet.activitaet.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class DataGenerationService {

  @Autowired private ActivityRepository activityRepository;

  private final List<String> activityTypes =
      Arrays.asList(
          "Joggen",
          "Lesen",
          "Kochen",
          "Meditation",
          "Gitarre spielen",
          "Yoga",
          "Malen",
          "Schwimmen",
          "Wandern",
          "Programmieren");

  private final List<String> locations =
      Arrays.asList(
          "Stadtpark",
          "Bücherei",
          "Gemeindezentrum",
          "Yogastudio",
          "Musikschule",
          "Fitnesscenter",
          "Kunstgalerie",
          "Schwimmbad",
          "Waldweg",
          "Coworking Space");

  @PostConstruct
  public void generateSampleData() {
    if (activityRepository.count() == 0) {
      Random random = new Random();
      for (int i = 0; i < 10; i++) {
        String name = activityTypes.get(random.nextInt(activityTypes.size()));
        String location = locations.get(random.nextInt(locations.size()));
        LocalDateTime startTime =
            LocalDateTime.now().plusDays(random.nextInt(30)).plusHours(random.nextInt(24));
        LocalDateTime endTime = startTime.plusHours(random.nextInt(5) + 1);
        double minPrice = random.nextDouble() * 50;
        double maxPrice = minPrice + (random.nextDouble() * 50);
        int minParticipants = random.nextInt(5) + 1;
        int maxParticipants = minParticipants + random.nextInt(20);

        Activity activity =
            new Activity(
                name,
                String.format(
                    "Tauchen Sie ein in die spannende Welt des %s und erleben Sie Momente voller Abenteuer, "
                        + "Herausforderung und persönlichem Wachstum. Diese faszinierende Aktivität bietet Ihnen die perfekte Gelegenheit, "
                        + "Ihre Grenzen zu erweitern, neue Fähigkeiten zu entwickeln und unvergessliche Erinnerungen zu schaffen. ",
                    name),
                random.nextInt(5) + 1,
                location,
                startTime,
                endTime,
                minPrice,
                maxPrice,
                minParticipants,
                maxParticipants);
        activityRepository.save(activity);
      }
    }
  }
}
