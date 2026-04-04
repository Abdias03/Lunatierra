package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.RecommendationResponse;
import com.lunatierra.backend.dto.DailyProgressResponse;
import com.lunatierra.backend.dto.WeatherSummary;
import com.lunatierra.backend.service.AuthenticatedUserService;
import com.lunatierra.backend.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Locale;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@Tag(name = "Recomendaciones", description = "Dashboard diario con clima, luna, progreso y recomendaciones.")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final AuthenticatedUserService authenticatedUserService;

    public RecommendationController(RecommendationService recommendationService,
                                    AuthenticatedUserService authenticatedUserService) {
        this.recommendationService = recommendationService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping
    @Operation(
            summary = "Obtener recomendaciones del día",
            description = "Devuelve el resumen principal para Home. Si no hay autenticación, devuelve una estructura vacía segura."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Respuesta generada correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor", content = @Content)
    })
    public RecommendationResponse getRecommendations(Locale locale,
                                                     @Parameter(description = "JWT opcional del usuario. Si no se envía, la respuesta será vacía.", example = "Bearer eyJhbGciOiJIUzI1NiJ9...")
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
