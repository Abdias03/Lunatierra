package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.LunarDayInsightResponse;
import com.lunatierra.backend.dto.OnboardingRecommendationResponse;
import com.lunatierra.backend.service.LunarRecommendationService;
import java.time.LocalDate;
import java.util.Locale;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final LunarRecommendationService lunarRecommendationService;

    public OnboardingController(LunarRecommendationService lunarRecommendationService) {
        this.lunarRecommendationService = lunarRecommendationService;
    }

    @GetMapping("/recommendation")
    public OnboardingRecommendationResponse getRecommendation(Locale locale) {
        return lunarRecommendationService.getTodayRecommendation(locale);
    }

    @GetMapping("/day-insight")
    public LunarDayInsightResponse getDayInsight(@RequestParam LocalDate date, Locale locale) {
        return lunarRecommendationService.getDayInsight(date, locale);
    }
}
