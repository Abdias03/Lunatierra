package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.RecommendationResponse;
import com.lunatierra.backend.service.RecommendationService;
import java.util.Locale;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public RecommendationResponse getRecommendations(Locale locale) {
        return recommendationService.getTodayRecommendations(locale);
    }
}
