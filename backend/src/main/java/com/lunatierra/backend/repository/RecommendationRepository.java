package com.lunatierra.backend.repository;

import com.lunatierra.backend.model.Recommendation;
import com.lunatierra.backend.model.RecommendationType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findAllByOrderByPriorityAscIdAsc();

    List<Recommendation> findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndActiveTrueAndRegionIsNullOrderByPriorityAscVersionDesc(
            String cropCode, Long stageId, String condition
    );

    List<Recommendation> findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndTypeInAndActiveTrueAndRegion_IdOrderByPriorityAscVersionDesc(
            String cropCode, Long stageId, String condition, Collection<RecommendationType> types, Long regionId
    );

    List<Recommendation> findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndActiveTrueAndRegion_IdOrderByPriorityAscVersionDesc(
            String cropCode, Long stageId, String condition, Long regionId
    );

    List<Recommendation> findByCropIsNullAndStageIsNullAndConditionAndActiveTrueAndRegionIsNullOrderByPriorityAscVersionDesc(
            String condition
    );

    List<Recommendation> findByCropIsNullAndStageIsNullAndConditionAndActiveTrueAndRegion_IdOrderByPriorityAscVersionDesc(
            String condition, Long regionId
    );

    List<Recommendation> findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndTypeInAndActiveTrueAndRegionIsNullOrderByPriorityAscVersionDesc(
            String cropCode, Long stageId, String condition, Collection<RecommendationType> types
    );
}
