package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByOrderByIdAsc();
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByGoogleSub(String googleSub);
    long countByLastCheckDate(LocalDate lastCheckDate);
    long countByLastCheckDateGreaterThanEqual(LocalDate lastCheckDate);
    List<User> findTop8ByOrderByLastCheckDateDescIdDesc();
}
