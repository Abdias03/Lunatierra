package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByOrderByIdAsc();
}
