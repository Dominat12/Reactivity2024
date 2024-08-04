package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.application.dto.UserDTO;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.mapper.UserMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Slf4j
@Data
@Service
public class DataGenerationService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

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
        User ghana = initUser();
        UserDTO ghanaDTO = userMapper.toDTO(ghana);
        log.info("Generating activity sample data");

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

                ActivityDTO activity =
                        ActivityDTO.builder()
                                .creator(ghanaDTO)
                                .name(name)
                                .description(
                                        String.format(
                                                "Tauchen Sie ein in die spannende Welt des %s und erleben Sie Momente voller Abenteuer, "
                                                        + "Herausforderung und persönlichem Wachstum. Diese faszinierende Aktivität bietet Ihnen die perfekte Gelegenheit, "
                                                        + "Ihre Grenzen zu erweitern, neue Fähigkeiten zu entwickeln und unvergessliche Erinnerungen zu schaffen. ",
                                                name))
                                .rating(random.nextInt(5) + 1)
                                .location(location)
                                .startTime(startTime)
                                .endTime(endTime)
                                .minPrice(minPrice)
                                .maxPrice(maxPrice)
                                .minParticipants(minParticipants)
                                .maxParticipants(maxParticipants)
                                .imagePath("/images/default-activity.jpg")
                                .build();

                activityService.createActivity(activity, ghana.getUsername());
            }
        }
    }

    public User initUser() {
        if (userRepository.count() == 0) {
            log.info("Generating user sample data");
            User user = User.builder()
                    .username("user")
                    .password("password")
                    .email("user@example.com")
                    .alias("User")
                    .birthDate(LocalDate.of(1990, 1, 1))
                    .firstName("Max")
                    .lastName("Mustermann")
                    .phoneNumber("1234567890")
                    .gender(User.Gender.MALE)
                    .role(User.Role.USER)
                    .build();
            userService.createUser(user);

            User admin = User.builder()
                    .username("admin")
                    .password("admin")
                    .email("admin@example.com")
                    .role(User.Role.ADMIN)
                    .build();
            userService.createUser(admin);

            // Activities without real creator are created by ghana
            User ghana = User.builder()
                    .username("ghana")
                    .password("ghana")
                    .email("ghana@example.com")
                    .role(User.Role.ADMIN)
                    .build();
            userService.createUser(ghana);

            // SuperAdmin
            User theCreator = User.builder()
                    .username("TheCreator")
                    .password("TheCreator")
                    .email("the-creator@example.com")
                    .role(User.Role.THE_CREATOR)
                    .build();
            userService.createUser(theCreator);
        }

        return userService.getUserByName("ghana");
    }
}
