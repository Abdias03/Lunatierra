package com.lunatierra.backend.service;

import com.lunatierra.backend.dto.CropDetailRecommendation;
import com.lunatierra.backend.dto.RecommendationItem;
import com.lunatierra.backend.dto.RecommendationResponse;
import com.lunatierra.backend.dto.UserCropResponse;
import com.lunatierra.backend.dto.WeatherSummary;
import java.util.ArrayList;
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
    private final WeatherService weatherService;
    private final LunarPhaseService lunarPhaseService;
    private final MessageSource messageSource;

    public RecommendationService(UserCropService userCropService, WeatherService weatherService,
                                 LunarPhaseService lunarPhaseService, MessageSource messageSource) {
        this.userCropService = userCropService;
        this.weatherService = weatherService;
        this.lunarPhaseService = lunarPhaseService;
        this.messageSource = messageSource;
    }

    public RecommendationResponse getTodayRecommendations(Locale locale) {
        Locale effectiveLocale = locale != null ? locale : LocaleContextHolder.getLocale();
        logger.debug("Building recommendations for locale {}", effectiveLocale);

        List<UserCropResponse> crops = userCropService.getAll(effectiveLocale);
        WeatherSummary weather = weatherService.getTodayForecast(effectiveLocale);
        String lunarPhase = lunarPhaseService.getCurrentPhase(effectiveLocale);
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
            String cropName = crop.getCropName().toLowerCase(Locale.ROOT);
            long days = crop.getDaysSincePlanting();
            cropDetails.add(buildCropDetail(crop, weather, effectiveLocale));

            if ("corn".equals(cropName) && days >= 5 && days <= 10) {
                items.add(new RecommendationItem(
                        message("recommendation.check_germination.title", effectiveLocale),
                        message("recommendation.check_germination.message", effectiveLocale, days),
                        "warning"
                ));
            }

            if ("beans".equals(cropName) && days >= 36 && days <= 55) {
                items.add(new RecommendationItem(
                        message("recommendation.protect_flowering.title", effectiveLocale),
                        message("recommendation.protect_flowering.message", effectiveLocale),
                        "info"
                ));
            }

            if ("squash".equals(cropName) && weather.getHumidity() > 75) {
                items.add(new RecommendationItem(
                        message("recommendation.pest_risk.title", effectiveLocale),
                        message("recommendation.pest_risk.message", effectiveLocale),
                        "warning"
                ));
            }

            if (days > 0 && growthStageMatchesHarvest(crop.getGrowthStage(), effectiveLocale)) {
                items.add(new RecommendationItem(
                        message("recommendation.ready_harvest.title", effectiveLocale),
                        message("recommendation.ready_harvest.message", effectiveLocale, localizeCropName(crop.getCropName(), effectiveLocale)),
                        "success"
                ));
            }

            if (!crop.isWaterAvailable() && weather.getRainChance() < 40) {
                items.add(new RecommendationItem(
                        message("recommendation.watch_water.title", effectiveLocale),
                        message("recommendation.watch_water.message", effectiveLocale, localizeCropName(crop.getCropName(), effectiveLocale)),
                        "warning"
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

        if (lunarPhaseService.isWaxingPhase()) {
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
        return new RecommendationResponse(lunarPhase, weather, dailyFocus, items, cropDetails);
    }

    private String message(String key, Locale locale, Object... args) {
        return messageSource.getMessage(key, args, key, locale);
    }

    private String localizeCropName(String cropName, Locale locale) {
        return message("crop.name." + cropName.toLowerCase(Locale.ROOT), locale);
    }

    private boolean growthStageMatchesHarvest(String stageName, Locale locale) {
        return message("crop.stage.harvest", locale).equals(stageName);
    }

    private CropDetailRecommendation buildCropDetail(UserCropResponse crop, WeatherSummary weather, Locale locale) {
        String cropName = crop.getCropName().toLowerCase(Locale.ROOT);
        long days = crop.getDaysSincePlanting();
        String localizedCrop = localizeCropName(crop.getCropName(), locale);

        String actionToday;
        String fieldObservation;
        List<String> warnings = new ArrayList<>();

        if ("corn".equals(cropName) && days <= 5) {
            actionToday = message("crop_detail.corn.early.action", locale);
            fieldObservation = message("crop_detail.corn.early.observation", locale);
            warnings.add(message("crop_detail.corn.early.warning", locale));
        } else if ("corn".equals(cropName) && days <= 15) {
            actionToday = message("crop_detail.corn.growth.action", locale);
            fieldObservation = message("crop_detail.corn.growth.observation", locale);
            if (weather.getHumidity() > 75) {
                warnings.add(message("crop_detail.corn.growth.warning_humidity", locale));
            }
        } else if ("beans".equals(cropName)) {
            actionToday = message("crop_detail.beans.action", locale);
            fieldObservation = message("crop_detail.beans.observation", locale);
            if (weather.getHumidity() > 75) {
                warnings.add(message("crop_detail.beans.warning_humidity", locale));
            }
        } else if ("squash".equals(cropName)) {
            actionToday = message("crop_detail.squash.action", locale);
            fieldObservation = message("crop_detail.squash.observation", locale);
            if (weather.getHumidity() > 75) {
                warnings.add(message("crop_detail.squash.warning_humidity", locale));
            }
        } else {
            actionToday = message("crop_detail.default.action", locale, localizedCrop);
            fieldObservation = message("crop_detail.default.observation", locale);
        }

        if (!crop.isWaterAvailable()) {
            warnings.add(message("crop_detail.warning.low_water", locale));
        }

        if (weather.getRainChance() > 70) {
            warnings.add(message("crop_detail.warning.high_rain", locale));
        }

        if (warnings.isEmpty()) {
            warnings.add(message("crop_detail.warning.none", locale));
        }

        return new CropDetailRecommendation(crop.getId(), actionToday, fieldObservation, warnings);
    }
}
