package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.AdminCreateCropRequest;
import com.lunatierra.backend.dto.AdminLunarActivityRequest;
import com.lunatierra.backend.dto.AdminCreateRecommendationRequest;
import com.lunatierra.backend.dto.AdminCreateStageRequest;
import com.lunatierra.backend.dto.AdminLunarActivityResponse;
import com.lunatierra.backend.dto.AdminOverviewResponse;
import com.lunatierra.backend.dto.AdminRecommendationResponse;
import com.lunatierra.backend.dto.AdminStageResponse;
import com.lunatierra.backend.dto.AdminUserSummary;
import com.lunatierra.backend.dto.CropCatalogItemResponse;
import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.CropStage;
import com.lunatierra.backend.model.CropType;
import com.lunatierra.backend.model.LunarActivity;
import com.lunatierra.backend.model.Recommendation;
import com.lunatierra.backend.model.RecommendationType;
import com.lunatierra.backend.model.Region;
import com.lunatierra.backend.repository.LunarActivityRepository;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.CropStageRepository;
import com.lunatierra.backend.repository.RecommendationRepository;
import com.lunatierra.backend.repository.RegionRepository;
import com.lunatierra.backend.repository.UserRepository;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CropCatalogService {

    private final CropRepository cropRepository;
    private final CropStageRepository cropStageRepository;
    private final RecommendationRepository recommendationRepository;
    private final RegionRepository regionRepository;
    private final LunarActivityRepository lunarActivityRepository;
    private final UserRepository userRepository;

    public CropCatalogService(CropRepository cropRepository,
                              CropStageRepository cropStageRepository,
                              RecommendationRepository recommendationRepository,
                              RegionRepository regionRepository,
                              LunarActivityRepository lunarActivityRepository,
                              UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.cropStageRepository = cropStageRepository;
        this.recommendationRepository = recommendationRepository;
        this.regionRepository = regionRepository;
        this.lunarActivityRepository = lunarActivityRepository;
        this.userRepository = userRepository;
    }

    public List<CropCatalogItemResponse> getCatalog() {
        return cropRepository.findAllByOrderByNameAsc().stream()
                .map(crop -> new CropCatalogItemResponse(
                        crop.getId(),
                        crop.getCode(),
                        crop.getName(),
                        crop.getDescription()
                ))
                .toList();
    }

    public CropCatalogItemResponse createCrop(@Valid AdminCreateCropRequest request) {
        Crop crop = new Crop(
                request.getCode().trim().toUpperCase(Locale.ROOT),
                request.getName().trim(),
                CropType.valueOf(request.getType().trim().toUpperCase(Locale.ROOT)),
                request.getDescription()
        );

        Crop saved = cropRepository.save(crop);
        return new CropCatalogItemResponse(saved.getId(), saved.getCode(), saved.getName(), saved.getDescription());
    }

    public List<AdminStageResponse> getStages() {
        return cropStageRepository.findAllByOrderByCrop_NameAscMinDayAsc().stream()
                .map(stage -> new AdminStageResponse(
                        stage.getId(),
                        stage.getCrop().getId(),
                        stage.getCrop().getName(),
                        stage.getName(),
                        stage.getMinDay(),
                        stage.getMaxDay(),
                        stage.getDescription()
                ))
                .toList();
    }

    public CropStage createStage(@Valid AdminCreateStageRequest request) {
        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

        CropStage stage = new CropStage(
                crop,
                request.getName().trim(),
                request.getMinDay(),
                request.getMaxDay(),
                request.getDescription()
        );

        return cropStageRepository.save(stage);
    }

    public Recommendation createRecommendation(@Valid AdminCreateRecommendationRequest request) {
        Crop crop = request.getCropId() == null
                ? null
                : cropRepository.findById(request.getCropId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

        CropStage stage = request.getStageId() == null
                ? null
                : cropStageRepository.findById(request.getStageId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stage not found"));

        Region region = request.getRegionId() == null
                ? null
                : regionRepository.findById(request.getRegionId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Region not found"));

        Recommendation recommendation = new Recommendation(
                crop,
                stage,
                request.getCondition().trim().toUpperCase(Locale.ROOT),
                RecommendationType.valueOf(request.getType().trim().toUpperCase(Locale.ROOT)),
                request.getMessage().trim(),
                request.getPriority() == null ? 999 : request.getPriority(),
                request.getVersion() == null ? 1 : request.getVersion(),
                request.getActive() == null ? Boolean.TRUE : request.getActive(),
                region
        );

        return recommendationRepository.save(recommendation);
    }

    public List<AdminRecommendationResponse> getRecommendations() {
        return recommendationRepository.findAllByOrderByPriorityAscIdAsc().stream()
                .map(recommendation -> new AdminRecommendationResponse(
                        recommendation.getId(),
                        recommendation.getCrop() != null ? recommendation.getCrop().getId() : null,
                        recommendation.getCrop() != null ? recommendation.getCrop().getName() : "General",
                        recommendation.getStage() != null ? recommendation.getStage().getId() : null,
                        recommendation.getStage() != null ? recommendation.getStage().getName() : "Todas",
                        recommendation.getCondition(),
                        recommendation.getType().name(),
                        recommendation.getMessage(),
                        recommendation.getPriority(),
                        recommendation.getVersion(),
                        recommendation.getActive(),
                        recommendation.getRegion() != null ? recommendation.getRegion().getId() : null,
                        recommendation.getRegion() != null ? recommendation.getRegion().getName() : null
                ))
                .toList();
    }

    public List<AdminLunarActivityResponse> getLunarActivities() {
        return lunarActivityRepository.findAllByOrderByPhaseAscIdAsc().stream()
                .map(activity -> new AdminLunarActivityResponse(
                        activity.getId(),
                        activity.getPhase(),
                        activity.getActivity()
                ))
                .toList();
    }

    public AdminLunarActivityResponse createLunarActivity(@Valid AdminLunarActivityRequest request) {
        LunarActivity saved = lunarActivityRepository.save(new LunarActivity(
                request.getPhase().trim().toUpperCase(Locale.ROOT),
                request.getActivity().trim()
        ));

        return new AdminLunarActivityResponse(saved.getId(), saved.getPhase(), saved.getActivity());
    }

    public AdminOverviewResponse getOverview() {
        LocalDate today = LocalDate.now();

        List<AdminUserSummary> recentUsers = userRepository.findTop8ByOrderByLastCheckDateDescIdDesc().stream()
                .map(user -> new AdminUserSummary(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getStreakCount(),
                        user.getLastCheckDate()
                ))
                .toList();

        return new AdminOverviewResponse(
                userRepository.count(),
                userRepository.countByLastCheckDate(today),
                userRepository.countByLastCheckDateGreaterThanEqual(today.minusDays(6)),
                cropRepository.count(),
                cropStageRepository.count(),
                recommendationRepository.count(),
                lunarActivityRepository.count(),
                recentUsers
        );
    }
}
