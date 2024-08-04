package de.aktivitaet.activitaet.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    private int rating;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double minPrice;
    private double maxPrice;
    private int minParticipants;
    private int maxParticipants;
    @Column(nullable = false)
    private String imagePath = "/images/default-activity.jpg";

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    // Konstruktor
    public Activity() {
    }

    public Activity(String name, String description, int rating, String location,
            LocalDateTime startTime, LocalDateTime endTime, double minPrice,
            double maxPrice, int minParticipants, int maxParticipants) {
        this.name = name;
        this.description = description;
        this.rating = rating;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minParticipants = minParticipants;
        this.maxParticipants = maxParticipants;
    }

    public Activity(String name, String description, int rating, String location,
            LocalDateTime startTime, LocalDateTime endTime, double minPrice,
            double maxPrice, int minParticipants, int maxParticipants, String imagePath) {
        this.name = name;
        this.description = description;
        this.rating = rating;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minParticipants = minParticipants;
        this.maxParticipants = maxParticipants;
        this.imagePath = imagePath;
    }


    public boolean isCreatedBy(User user) {
        return this.creator != null && this.creator.equals(user);
    }

}
