package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.CreateUserCropRequest;
import com.lunatierra.backend.dto.GrowthStageDefinition;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.model.Crop;
import com.lunatierra.backend.model.User;
import com.lunatierra.backend.model.UserCrop;
import com.lunatierra.backend.repository.CropRepository;
import com.lunatierra.backend.repository.UserCropRepository;
import com.lunatierra.backend.repository.UserRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserCropService {

    private final UserCropRepository userCropRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final GrowthStageService growthStageService;
    private final MessageSource messageSource;

    public UserCropService(UserCropRepository userCropRepository, CropRepository cropRepository,
                           UserRepository userRepository, GrowthStageService growthStageService,
                           MessageSource messageSource) {
        this.userCropRepository = userCropRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
        this.growthStageService = growthStageService;
        this.messageSource = messageSource;
    }

    public UserCropResponse create(CreateUserCropRequest request, Locale locale) {
        Crop crop = cropRepository.findByNameIgnoreCase(request.getCropName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop not supported"));
        User user = userRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default user missing"));

        UserCrop userCrop = new UserCrop(user, crop, request.getPlantingDate(), Boolean.TRUE.equals(request.getWaterAvailable()));
        UserCrop saved = userCropRepository.save(userCrop);
        return toResponse(saved, locale);
    }

    public List<UserCropResponse> getAll(Locale locale) {
        return userCropRepository.findAllByOrderByPlantingDateDesc().stream()
                .map(userCrop -> toResponse(userCrop, locale))
                .toList();
    }

    private UserCropResponse toResponse(UserCrop userCrop, Locale locale) {
        long days = ChronoUnit.DAYS.between(userCrop.getPlantingDate(), LocalDate.now());
        GrowthStageDefinition stage = growthStageService.resolveStage(userCrop.getCrop().getName(), Math.max(0, days));
        return new UserCropResponse(
                userCrop.getId(),
                userCrop.getCrop().getName(),
                userCrop.getPlantingDate(),
                Boolean.TRUE.equals(userCrop.getWaterAvailable()),
                Math.max(0, days),
                messageSource.getMessage(stage.getNameKey(), null, locale),
                messageSource.getMessage(stage.getExpectedBehaviorKey(), null, locale)
        );
    }
}
