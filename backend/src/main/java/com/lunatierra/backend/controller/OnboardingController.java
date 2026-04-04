package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.LunarDayInsightResponse;
import com.lunatierra.backend.dto.OnboardingRecommendationResponse;
import com.lunatierra.backend.service.LunarRecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/onboarding")
@Tag(name = "Onboarding", description = "Sugerencias inteligentes para comenzar según fecha, luna y temporada.")
public class OnboardingController {

    private static final Logger logger = LoggerFactory.getLogger(OnboardingController.class);
    private final LunarRecommendationService lunarRecommendationService;

    public OnboardingController(LunarRecommendationService lunarRecommendationService) {
        this.lunarRecommendationService = lunarRecommendationService;
    }

    @GetMapping("/recommendation")
    @Operation(
            summary = "Obtener recomendación de onboarding",
            description = "Devuelve una sugerencia rápida de qué sembrar hoy según fase lunar y fecha actual."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Recomendación generada correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public OnboardingRecommendationResponse getRecommendation(Locale locale) {
        logger.info("[OnboardingController] getRecommendation called, locale={}", locale);
        OnboardingRecommendationResponse response = lunarRecommendationService.getTodayRecommendation(locale);
        logger.info("[OnboardingController] getRecommendation response={}", response);
        return response;
    }

    @GetMapping("/day-insight")
    @Operation(
            summary = "Obtener insight lunar por día",
            description = "Devuelve mensaje, acciones, restricciones y cultivos sugeridos para una fecha específica."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Insight generado correctamente"),
            @ApiResponse(responseCode = "400", description = "Fecha inválida"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public LunarDayInsightResponse getDayInsight(
            @Parameter(description = "Fecha objetivo en formato ISO.", example = "2026-04-02")
            @RequestParam LocalDate date,
            Locale locale) {
        logger.info("[OnboardingController] getDayInsight called, date={}, locale={}", date, locale);
        LunarDayInsightResponse response = lunarRecommendationService.getDayInsight(date, locale);
        logger.info("[OnboardingController] getDayInsight response={}", response);
        return response;
    }
}
