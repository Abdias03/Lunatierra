package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.GrowthLog;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrowthLogRepository extends JpaRepository<GrowthLog, Long> {

    List<GrowthLog> findAllByUserCrop_IdOrderByCreatedAtDesc(Long userCropId);

    Optional<GrowthLog> findByIdAndUserCrop_IdAndUserCrop_User_Id(Long id, Long userCropId, Long userId);
}
