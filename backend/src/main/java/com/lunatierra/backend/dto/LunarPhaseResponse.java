package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Resumen de fase lunar y sugerencias agrícolas asociadas.")
public class LunarPhaseResponse {

    @Schema(description = "Clave estable de la fase lunar.", example = "FULL_MOON")
    private final String phase;
    @Schema(description = "Nombre visible de la fase lunar.", example = "Luna llena")
    private final String displayName;
    @Schema(description = "Actividades recomendadas para la fase actual.")
    private final List<String> activities;
    @Schema(description = "Cultivos recomendados para sembrar según mes y fase lunar.")
    private final List<String> recommendedCrops;

    public LunarPhaseResponse(String phase, String displayName, List<String> activities, List<String> recommendedCrops) {
        this.phase = phase;
        this.displayName = displayName;
        this.activities = activities;
        this.recommendedCrops = recommendedCrops;
    }

    public String getPhase() {
        return phase;
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getActivities() {
        return activities;
    }

    public List<String> getRecommendedCrops() {
        return recommendedCrops;
    }
}
