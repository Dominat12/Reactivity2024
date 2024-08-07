package de.aktivitaet.activitaet.domain.service;

import de.aktivitaet.activitaet.application.dto.ActivityDTO;
import de.aktivitaet.activitaet.application.dto.UserDTO;
import de.aktivitaet.activitaet.domain.model.Activity;
import de.aktivitaet.activitaet.domain.model.User;
import de.aktivitaet.activitaet.domain.repository.ActivityRepository;
import de.aktivitaet.activitaet.domain.repository.UserRepository;
import de.aktivitaet.activitaet.infrastructure.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Data
@Service
public class DataGenerationService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    private final Random RANDOM_SEED = new Random(42);

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
    @Transactional
    public void generateSampleData() {
        User ghana = initSpecialUser();
        log.info("Generating activity sample data");

        List<Activity> activities = generateActivities(ghana);
        List<User> users = generateRandomUsers();
        assignUsersToActivities(users, activities);

        // Generate additional events for user "user"
        User regularUser = userService.getUserByName("user");
        List<Activity> userActivities = generateUserActivities(regularUser, 3);
        assignUsersToActivities(users, userActivities);
    }

    private List<Activity> generateActivities(User creator) {
        if (activityRepository.count() == 0) {
            return IntStream.range(0, 10)
                    .mapToObj(i -> createActivity(creator))
                    .collect(Collectors.toList());
        }
        return activityRepository.findAll();
    }

    private List<Activity> generateUserActivities(User creator, int count) {
        log.info("Generating {} activities for user {}", count, creator.getUsername());
        return IntStream.range(0, count)
                .mapToObj(i -> createActivity(creator))
                .collect(Collectors.toList());
    }


    private Activity createActivity(User creator) {
        String name = activityTypes.get(RANDOM_SEED.nextInt(activityTypes.size()));
        String location = locations.get(RANDOM_SEED.nextInt(locations.size()));

        // Generate start time in 30-minute intervals
        LocalDateTime now = LocalDateTime.now();
        int daysToAdd = RANDOM_SEED.nextInt(30);
        int hoursToAdd = RANDOM_SEED.nextInt(48); // 48 half-hours in a day
        LocalDateTime startTime = now.plusDays(daysToAdd)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0)
                .plusMinutes(30 * hoursToAdd);

        // Ensure end time is also in 30-minute intervals
        int durationInHalfHours = RANDOM_SEED.nextInt(10) + 2; // 1 to 5 hours, in half-hour increments
        LocalDateTime endTime = startTime.plusMinutes(30 * durationInHalfHours);

        // Generate whole Euro amounts for prices
        int minPrice = RANDOM_SEED.nextInt(51); // 0 to 50 euros
        int maxPrice = minPrice + RANDOM_SEED.nextInt(51); // minPrice to minPrice + 50 euros

        int minParticipants = RANDOM_SEED.nextInt(5) + 1;
        int maxParticipants = minParticipants + RANDOM_SEED.nextInt(20);

        Activity activity = new Activity();
        activity.setCreator(creator);
        activity.setName(name);
        activity.setDescription(String.format("Tauchen Sie ein in die spannende Welt des %s und erleben Sie Momente voller Abenteuer, "
                + "Herausforderung und persönlichem Wachstum. Diese faszinierende Aktivität bietet Ihnen die perfekte Gelegenheit, "
                + "Ihre Grenzen zu erweitern, neue Fähigkeiten zu entwickeln und unvergessliche Erinnerungen zu schaffen. ", name));
        activity.setRating(RANDOM_SEED.nextInt(5) + 1);
        activity.setLocation(location);
        activity.setStartTime(startTime);
        activity.setEndTime(endTime);
        activity.setMinPrice(minPrice);
        activity.setMaxPrice(maxPrice);
        activity.setMinParticipants(minParticipants);
        activity.setMaxParticipants(maxParticipants);
        activity.setImagePath("/images/default-activity.jpg");

        return activityRepository.save(activity);
    }

    private List<User> generateRandomUsers() {
        if (userRepository.count() <= 5) { // Assuming we already have some users (admin, ghana, etc.)
            return IntStream.range(0, 20)
                    .mapToObj(i -> createRandomUser(i))
                    .collect(Collectors.toList());
        }
        return userRepository.findAll();
    }

    private User createRandomUser(int index) {
        String username = "user" + (index + 1);
        String password = "password" + (index + 1);
        String email = username + "@example.com";
        String firstName = getRandomName();
        String lastName = getRandomName();
        LocalDate birthDate = LocalDate.now().minusYears(20 + RANDOM_SEED.nextInt(40));
        String phoneNumber = "1234" + String.format("%06d", RANDOM_SEED.nextInt(1000000));
        User.Gender gender = User.Gender.values()[RANDOM_SEED.nextInt(User.Gender.values().length)];
        User.Role role = RANDOM_SEED.nextDouble() < 0.1 ? User.Role.ADMIN : User.Role.USER;

        User user = User.builder()
                .username(username)
                .password(password)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .birthDate(birthDate)
                .phoneNumber(phoneNumber)
                .gender(gender)
                .role(role)
                .build();

        return userService.createUser(user);
    }

    private String getRandomName() {
        String[] names = {"John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah"};
        return names[RANDOM_SEED.nextInt(names.length)];
    }

    private void assignUsersToActivities(List<User> users, List<Activity> activities) {
        log.info("Assigning users to activities");
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            for (int j = 0; j < activities.size(); j++) {
                if ((i + j) % 3 == 0) { // This ensures a deterministic but varied participation pattern
                    Activity activity = activities.get(j);
                    if (!activity.isCreatedBy(user) && !activity.isParticipant(user)) {
                        log.info("Adding user {} with id {} to activity {}", user.getUsername(), user.getId(), activity.getName());
                        activity.addParticipant(user);
                    }
                }
            }
        }

        for (Activity activity : activities) {
            activityRepository.save(activity);
        }
    }




    /**
     * Special users
     * @return
     */
    public User initSpecialUser() {
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
