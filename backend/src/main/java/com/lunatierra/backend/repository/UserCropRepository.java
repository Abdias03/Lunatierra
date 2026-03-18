package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.UserCrop;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCropRepository extends JpaRepository<UserCrop, Long> {
    List<UserCrop> findAllByOrderByPlantingDateDesc();
}
