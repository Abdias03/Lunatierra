package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.RecommendationResponse;
import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.dto.WeatherSummary;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.RecommendationService;
import java.util.List;
import java.util.Locale;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final AuthenticatedUserService authenticatedUserService;

    public RecommendationController(RecommendationService recommendationService,
                                    AuthenticatedUserService authenticatedUserService) {
        this.recommendationService = recommendationService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping
    public RecommendationResponse getRecommendations(Locale locale,
                                                     @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserService.getOptionalUserId(authorizationHeader);
        if (userId == null) {
            return new RecommendationResponse(
                    "",
                    new WeatherSummary("", 0, 0, 0),
                    "",
                    "",
                    List.of(),
                    List.of(),
                    new DailyProgressResponse(0, null, false)
            );
        }
        return recommendationService.getTodayRecommendations(userId, locale);
    }
}
