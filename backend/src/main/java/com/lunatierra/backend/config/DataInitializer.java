package com.lunatierra.backend.config;

import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.User;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository, CropRepository cropRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User("Farmer Demo"));
            }

            if (cropRepository.count() == 0) {
                cropRepository.save(new Crop("corn"));
                cropRepository.save(new Crop("beans"));
                cropRepository.save(new Crop("squash"));
            }
        };
    }
}
