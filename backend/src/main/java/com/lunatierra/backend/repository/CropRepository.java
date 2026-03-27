package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.Crop;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropRepository extends JpaRepository<Crop, Long> {
    Optional<Crop> findByCodeIgnoreCase(String code);

    List<Crop> findAllByOrderByNameAsc();
}
