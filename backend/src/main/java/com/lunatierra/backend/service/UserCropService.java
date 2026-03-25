package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.CreateUserCropRequest;
import com.lunatierra.backend.dto.MigrateCropItem;
import com.lunatierra.backend.dto.MigrateUserDataRequest;
import com.lunatierra.backend.dto.StageInsight;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.CropStage;
import com.lunatierra.backend.model.User;
import com.lunatierra.backend.model.UserCrop;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.UserCropRepository;
import com.lunatierra.backend.repository.UserRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserCropService {

    private final UserCropRepository userCropRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final StageService stageService;
    private final MessageSource messageSource;

    public UserCropService(UserCropRepository userCropRepository, CropRepository cropRepository,
                           UserRepository userRepository, StageService stageService,
                           MessageSource messageSource) {
        this.userCropRepository = userCropRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
        this.stageService = stageService;
        this.messageSource = messageSource;
    }

    public UserCropResponse create(Long userId, CreateUserCropRequest request, Locale locale) {
        Crop crop = cropRepository.findByCodeIgnoreCase(request.getCropName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop not supported"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        UserCrop userCrop = new UserCrop(user, crop, request.getPlantingDate(), Boolean.TRUE.equals(request.getWaterAvailable()));
        UserCrop saved = userCropRepository.save(userCrop);
        return toResponse(saved, locale);
    }

    public List<UserCropResponse> getAll(Long userId, Locale locale) {
        List<UserCrop> userCrops = userCropRepository.findAllByUser_IdOrderByPlantingDateDesc(userId);
        Map<Long, List<CropStage>> stagesByCropId = stageService.getStagesByCropIds(
                userCrops.stream().map(UserCrop::getCrop).distinct().toList()
        );

        return userCrops.stream()
                .map(userCrop -> toResponse(userCrop, locale, stagesByCropId.getOrDefault(userCrop.getCrop().getId(), List.of())))
                .toList();
    }

    private UserCropResponse toResponse(UserCrop userCrop, Locale locale) {
        long days = ChronoUnit.DAYS.between(userCrop.getPlantingDate(), LocalDate.now());
        StageInsight stage = stageService.resolveStage(userCrop.getCrop(), Math.max(0, days), locale);
        return buildResponse(userCrop, stage, days);
    }

    public UserCropResponse getById(Long userId, Long id, Locale locale) {
        UserCrop userCrop = userCropRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));
        long days = ChronoUnit.DAYS.between(userCrop.getPlantingDate(), LocalDate.now());
        StageInsight stage = stageService.resolveStage(userCrop.getCrop(), Math.max(0, days), locale);
        return buildResponse(userCrop, stage, days);
    }

    public void migrateGuestCrops(Long userId, MigrateUserDataRequest request) {
        if (request == null || request.getCrops() == null || request.getCrops().isEmpty()) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        List<UserCrop> migrated = request.getCrops().stream()
                .map(item -> toUserCrop(user, item))
                .filter(item -> item != null)
                .toList();

        if (!migrated.isEmpty()) {
            userCropRepository.saveAll(migrated);
        }
    }

    private UserCrop toUserCrop(User user, MigrateCropItem item) {
        if (item == null || item.getCropName() == null || item.getPlantingDate() == null) {
            return null;
        }

        Crop crop = cropRepository.findByCodeIgnoreCase(item.getCropName())
                .orElseGet(() -> cropRepository.findByCodeIgnoreCase(item.getCropName().toUpperCase(Locale.ROOT)).orElse(null));

        if (crop == null) {
            return null;
        }

        return new UserCrop(user, crop, item.getPlantingDate(), Boolean.TRUE.equals(item.getWaterAvailable()));
    }

    private UserCropResponse toResponse(UserCrop userCrop, Locale locale, List<CropStage> stages) {
        long days = ChronoUnit.DAYS.between(userCrop.getPlantingDate(), LocalDate.now());
        StageInsight stage = stageService.resolveStageFromStages(stages, Math.max(0, days), locale);
        return buildResponse(userCrop, stage, days);
    }

    private UserCropResponse buildResponse(UserCrop userCrop, StageInsight stage, long days) {
        return new UserCropResponse(
                userCrop.getId(),
                userCrop.getCrop().getCode().toLowerCase(Locale.ROOT),
                userCrop.getCrop().getName(),
                userCrop.getPlantingDate(),
                Boolean.TRUE.equals(userCrop.getWaterAvailable()),
                Math.max(0, days),
                stage.getName(),
                stage.getDescription()
        );
    }
}
