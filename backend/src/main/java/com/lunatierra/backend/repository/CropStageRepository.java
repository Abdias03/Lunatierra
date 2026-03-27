package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.CropStage;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropStageRepository extends JpaRepository<CropStage, Long> {

    List<CropStage> findByCropOrderByMinDayAsc(Crop crop);

    List<CropStage> findByCropInOrderByCropIdAscMinDayAsc(Collection<Crop> crops);

    List<CropStage> findAllByOrderByCrop_NameAscMinDayAsc();

    Optional<CropStage> findByCrop_CodeIgnoreCaseAndName(String cropCode, String name);
}
