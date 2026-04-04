package com.lunatierra.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Respuesta principal del dashboard diario.")
public class RecommendationResponse {

    @Schema(description = "Fase lunar visible para el usuario.", example = "Cuarto creciente")
    private final String lunarPhase;
    @Schema(description = "Resumen del clima del día.")
    private final WeatherSummary weather;
    @Schema(description = "Foco principal del día para el usuario.", example = "Hoy revisa tu cultivo principal")
    private final String dailyFocus;
    @Schema(description = "Mensaje emocional o recordatorio del día.", example = "Tu planta te espera hoy 🌱")
    private final String dailyMessage;
    @Schema(description = "Recomendaciones generales del día.")
    private final List<RecommendationItem> recommendations;
    @Schema(description = "Detalle por cultivo registrado.")
    private final List<CropDetailRecommendation> cropDetails;
    @Schema(description = "Progreso diario del usuario.")
    private final DailyProgressResponse dailyProgress;

    public RecommendationResponse(String lunarPhase, WeatherSummary weather, String dailyFocus,
                                  String dailyMessage,
                                  List<RecommendationItem> recommendations,
                                  List<CropDetailRecommendation> cropDetails,
                                  DailyProgressResponse dailyProgress) {
        this.lunarPhase = lunarPhase;
        this.weather = weather;
        this.dailyFocus = dailyFocus;
        this.dailyMessage = dailyMessage;
        this.recommendations = recommendations;
        this.cropDetails = cropDetails;
        this.dailyProgress = dailyProgress;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public WeatherSummary getWeather() {
        return weather;
    }

    public String getDailyFocus() {
        return dailyFocus;
    }

    public String getDailyMessage() {
        return dailyMessage;
    }

    public List<RecommendationItem> getRecommendations() {
        return recommendations;
    }

    public List<CropDetailRecommendation> getCropDetails() {
        return cropDetails;
    }

    public DailyProgressResponse getDailyProgress() {
        return dailyProgress;
    }
}
