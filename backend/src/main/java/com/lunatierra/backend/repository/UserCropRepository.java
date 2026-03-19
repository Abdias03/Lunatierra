package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.UserCrop;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCropRepository extends JpaRepository<UserCrop, Long> {

    @EntityGraph(attributePaths = {"crop"})
    List<UserCrop> findAllByOrderByPlantingDateDesc();

    @Override
    @EntityGraph(attributePaths = {"crop"})
    Optional<UserCrop> findById(Long id);
}
