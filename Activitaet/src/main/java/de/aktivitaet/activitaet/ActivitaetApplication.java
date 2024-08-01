package de.aktivitaet.activitaet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
public class ActivitaetApplication {

	public static void main(String[] args) {
		SpringApplication.run(ActivitaetApplication.class, args);
	}

}
