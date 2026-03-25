package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.CropDetailRecommendation;
import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.dto.RecommendationItem;
import com.lunatierra.backend.dto.RecommendationResponse;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.dto.WeatherSummary;
import com.lunatierra.backend.model.Recommendation;
import com.lunatierra.backend.model.RecommendationType;
import java.time.LocalDate;
import com.lunatierra.backend.repository.CropStageRepository;
import com.lunatierra.backend.repository.RecommendationRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    private final UserCropService userCropService;
    private final StageService stageService;
    private final ConditionService conditionService;
    private final WeatherService weatherService;
    private final LunarService lunarService;
    private final DailyProgressService dailyProgressService;
    private final CropStageRepository cropStageRepository;
    private final RecommendationRepository recommendationRepository;
    private final MessageSource messageSource;

    public RecommendationService(UserCropService userCropService, StageService stageService,
                                 ConditionService conditionService,
                                 WeatherService weatherService, LunarService lunarService,
                                 DailyProgressService dailyProgressService,
                                 CropStageRepository cropStageRepository,
                                 RecommendationRepository recommendationRepository,
                                 MessageSource messageSource) {
        this.userCropService = userCropService;
        this.stageService = stageService;
        this.conditionService = conditionService;
        this.weatherService = weatherService;
        this.lunarService = lunarService;
        this.dailyProgressService = dailyProgressService;
        this.cropStageRepository = cropStageRepository;
        this.recommendationRepository = recommendationRepository;
        this.messageSource = messageSource;
    }

    public RecommendationResponse getTodayRecommendations(Long userId, Locale locale) {
        Locale effectiveLocale = locale != null ? locale : LocaleContextHolder.getLocale();
        logger.debug("Building recommendations for locale {}", effectiveLocale);

        List<UserCropResponse> crops = userCropService.getAll(userId, effectiveLocale);
        WeatherSummary weather = weatherService.getTodayForecast(effectiveLocale);
        String lunarPhase = lunarService.getCurrentPhaseDisplayName(effectiveLocale);
        List<RecommendationItem> items = new ArrayList<>();
        List<CropDetailRecommendation> cropDetails = new ArrayList<>();

        if (crops.isEmpty()) {
            items.add(new RecommendationItem(
                    message("recommendation.start_log.title", effectiveLocale),
                    message("recommendation.start_log.message", effectiveLocale),
                    "info"
            ));
        }

        for (UserCropResponse crop : crops) {
            var stage = stageService.resolveStage(crop.getCropName(), crop.getDaysSincePlanting(), effectiveLocale);
            List<String> conditions = conditionService.determineWeatherConditions(weather);
            RecommendationInsight insight = resolveInsight(
                    crop.getCropName(),
                    stage.getId(),
                    stage.getKey(),
                    conditions,
                    null,
                    crop.isWaterAvailable(),
                    effectiveLocale
            );
            cropDetails.add(new CropDetailRecommendation(
                    crop.getId(),
                    insight.actionToday(),
                    insight.observation(),
                    insight.reason(),
                    insight.warnings()
            ));
            items.add(new RecommendationItem(
                    localizeCropName(crop.getCropName(), effectiveLocale),
                    insight.actionToday(),
                    "info"
            ));
            if (growthStageMatchesHarvest(crop.getGrowthStage(), effectiveLocale)) {
                items.add(new RecommendationItem(
                        message("recommendation.ready_harvest.title", effectiveLocale),
                        message("recommendation.ready_harvest.message", effectiveLocale, localizeCropName(crop.getCropName(), effectiveLocale)),
                        "success"
                ));
            }
        }

        if (weather.getRainChance() > 70) {
            items.add(new RecommendationItem(
                    message("recommendation.avoid_pesticide.title", effectiveLocale),
                    message("recommendation.avoid_pesticide.message", effectiveLocale),
                    "warning"
            ));
        }

        if (lunarService.isWaxingPhase()) {
            items.add(new RecommendationItem(
                    message("recommendation.fertilization.title", effectiveLocale),
                    message("recommendation.fertilization.message", effectiveLocale),
                    "success"
            ));
        }

        if (items.isEmpty()) {
            items.add(new RecommendationItem(
                    message("recommendation.keep_monitoring.title", effectiveLocale),
                    message("recommendation.keep_monitoring.message", effectiveLocale),
                    "info"
            ));
        }

        String dailyFocus = items.get(0).getMessage();
        DailyProgressResponse dailyProgress = dailyProgressService.getProgress(userId);
        String dailyMessage = buildDailyMessage(crops, weather, dailyProgress, effectiveLocale);
        return new RecommendationResponse(
                lunarPhase,
                weather,
                dailyFocus,
                dailyMessage,
                items,
                cropDetails,
                dailyProgress
        );
    }

    private String message(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, key, locale);
    }

    private String localizeCropName(String cropName, Locale locale) {
        return message("crop.name." + cropName.toLowerCase(Locale.ROOT), locale);
    }

    private boolean growthStageMatchesHarvest(String stageName, Locale locale) {
        return message("crop.stage.maturation", locale).equals(stageName)
                || message("crop.stage.harvest", locale).equals(stageName);
    }

    private String buildDailyMessage(List<UserCropResponse> crops, WeatherSummary weather,
                                     DailyProgressResponse dailyProgress, Locale locale) {
        LocalDate today = LocalDate.now();
        UserCropResponse featuredCrop = crops.isEmpty() ? null : crops.get(0);

        if (weather.getRainChance() > 70) {
            return message("daily.message.rain", locale);
        }

        if (dailyProgress.getLastCheckDate() != null
                && dailyProgress.getLastCheckDate().isBefore(today.minusDays(1))) {
            return message("daily.message.missed", locale);
        }

        if (dailyProgress.getStreakCount() == 0) {
            return message("daily.message.waiting", locale);
        }

        if (featuredCrop != null && !featuredCrop.isWaterAvailable()) {
            return message("daily.message.low_water", locale);
        }

        if (featuredCrop != null && featuredCrop.getDaysSincePlanting() >= 15 && dailyProgress.getStreakCount() >= 3) {
            return message("daily.message.progress", locale);
        }

        return message("daily.message.default", locale);
    }

    public RecommendationInsight resolveInsight(String cropName, Long stageId, String stageKey, List<String> conditionKeys,
                                                Long regionId,
                                                boolean waterAvailable, Locale locale) {
        Long effectiveStageId = stageId != null
                ? stageId
                : cropStageRepository.findByCrop_CodeIgnoreCaseAndName(cropName, stageKey)
                .map(stage -> stage.getId())
                .orElse(null);

        List<RecommendationType> scopedTypes = List.of(
                RecommendationType.ACTION,
                RecommendationType.OBSERVATION,
                RecommendationType.WARNING
        );

        List<Recommendation> specificRules = List.of();
        if (effectiveStageId != null) {
            for (String conditionKey : conditionKeys) {
                specificRules = findScopedRules(cropName, effectiveStageId, conditionKey, scopedTypes, regionId);
                if (!specificRules.isEmpty()) {
                    break;
                }
            }

            if (specificRules.isEmpty()) {
                specificRules = findScopedRules(cropName, effectiveStageId, "ANY", scopedTypes, regionId);
            }
        }

        List<Recommendation> conditionRules = new ArrayList<>();
        for (String conditionKey : conditionKeys) {
            conditionRules.addAll(findGlobalRules(conditionKey, regionId));
        }

        List<Recommendation> waterRules = !waterAvailable
                ? findGlobalRules("LOW_WATER", regionId)
                : List.of();

        String actionToday = firstMessageByType(specificRules, RecommendationType.ACTION);
        if (actionToday == null) {
            actionToday = "Sigue observando tu cultivo y evita cambios bruscos en el manejo.";
        }

        String observation = firstMessageByType(specificRules, RecommendationType.OBSERVATION);
        if (observation == null) {
            observation = "Observa color de hojas, humedad del suelo y fuerza general de la planta.";
        }

        String reason = buildReason(stageKey, conditionKeys, waterAvailable);

        List<String> warnings = new ArrayList<>(messagesByType(specificRules, RecommendationType.WARNING));
        warnings.addAll(messagesByType(conditionRules, RecommendationType.WARNING));
        warnings.addAll(messagesByType(waterRules, RecommendationType.WARNING));
        if (!waterAvailable) {
            String lowWaterWarning = "No hay suficiente agua disponible, prioriza riego.";
            if (!warnings.contains(lowWaterWarning)) {
                warnings.add(lowWaterWarning);
            }
        }

        if (warnings.isEmpty()) {
            warnings.add("No hay alertas importantes para hoy. Sigue tu recorrido habitual.");
        }

        return new RecommendationInsight(actionToday, observation, reason, warnings);
    }

    private List<Recommendation> findScopedRules(String cropCode, Long stageId, String condition,
                                                 Collection<RecommendationType> types, Long regionId) {
        if (regionId != null) {
            List<Recommendation> regionalRules =
                    recommendationRepository.findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndTypeInAndActiveTrueAndRegion_IdOrderByPriorityAscVersionDesc(
                            cropCode, stageId, condition, types, regionId
                    );
            if (!regionalRules.isEmpty()) {
                return regionalRules;
            }
        }

        return recommendationRepository.findByCrop_CodeIgnoreCaseAndStage_IdAndConditionAndTypeInAndActiveTrueAndRegionIsNullOrderByPriorityAscVersionDesc(
                cropCode, stageId, condition, types
        );
    }

    private List<Recommendation> findGlobalRules(String condition, Long regionId) {
        if (regionId != null) {
            List<Recommendation> regionalRules =
                    recommendationRepository.findByCropIsNullAndStageIsNullAndConditionAndActiveTrueAndRegion_IdOrderByPriorityAscVersionDesc(
                            condition, regionId
                    );
            if (!regionalRules.isEmpty()) {
                return regionalRules;
            }
        }

        return recommendationRepository.findByCropIsNullAndStageIsNullAndConditionAndActiveTrueAndRegionIsNullOrderByPriorityAscVersionDesc(
                condition
        );
    }

    private String buildReason(String stageKey, List<String> conditionKeys, boolean waterAvailable) {
        StringBuilder reason = new StringBuilder("La recomendación se generó por la etapa ");
        reason.append(stageKey);

        if (!conditionKeys.isEmpty()) {
            reason.append(" y las condiciones ");
            reason.append(String.join(", ", conditionKeys));
        }

        if (!waterAvailable) {
            reason.append(". Además, no hay suficiente agua disponible");
        }

        reason.append(".");
        return reason.toString();
    }

    private String firstMessageByType(List<Recommendation> recommendations, RecommendationType type) {
        return recommendations.stream()
                .filter(rule -> rule.getType() == type)
                .map(Recommendation::getMessage)
                .findFirst()
                .orElse(null);
    }

    private List<String> messagesByType(List<Recommendation> recommendations, RecommendationType type) {
        return recommendations.stream()
                .filter(rule -> rule.getType() == type)
                .map(Recommendation::getMessage)
                .distinct()
                .toList();
    }

    public record RecommendationInsight(String actionToday, String observation, String reason, List<String> warnings) {
    }
}
