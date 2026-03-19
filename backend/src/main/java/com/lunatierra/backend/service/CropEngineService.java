package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.CropIntelligenceResponse;
import com.lunatierra.backend.dto.LunarPhaseResponse;
import com.lunatierra.backend.dto.StageInsight;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.dto.WeatherSummary;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CropEngineService {

    private final StageService stageService;
    private final WeatherService weatherService;
    private final LunarService lunarService;
    private final RecommendationService recommendationService;
    private final ConditionService conditionService;

    public CropEngineService(StageService stageService, WeatherService weatherService, LunarService lunarService,
                             RecommendationService recommendationService, ConditionService conditionService) {
        this.stageService = stageService;
        this.weatherService = weatherService;
        this.lunarService = lunarService;
        this.recommendationService = recommendationService;
        this.conditionService = conditionService;
    }

    public CropIntelligenceResponse buildInsight(UserCropResponse crop, Locale locale) {
        WeatherSummary weather = weatherService.getTodayForecast(locale);
        return buildInsight(crop, weather, locale);
    }

    public CropIntelligenceResponse buildInsight(UserCropResponse crop, WeatherSummary weather, Locale locale) {
        StageInsight stage = stageService.resolveStage(crop.getCropName(), crop.getDaysSincePlanting(), locale);
        List<String> conditions = conditionService.determineWeatherConditions(weather);
        LunarPhaseResponse lunarPhase = lunarService.getCurrentPhase(locale);
        RecommendationService.RecommendationInsight recommendation = recommendationService.resolveInsight(
                crop.getCropName(),
                stage.getId(),
                stage.getKey(),
                conditions,
                null,
                crop.isWaterAvailable(),
                locale
        );

        return new CropIntelligenceResponse(
                stage,
                recommendation.actionToday(),
                recommendation.observation(),
                recommendation.reason(),
                recommendation.warnings(),
                lunarPhase.getDisplayName(),
                lunarPhase.getActivities(),
                weather
        );
    }
}
